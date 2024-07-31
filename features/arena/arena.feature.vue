<script lang="ts" setup>
import chroma from "chroma-js";
import matterjs from "matter-js";
import prettyBytes from "pretty-bytes";
import { ulid } from "ulidx";

import { ADD_RANDOM_BALL, type AddRandomBallEventPayload, BALL_HIT_WORD, type BallHitWordEventPayload, HOVER_ON_WORD, type HoverOnWordEventPayload, REMOVE_BALL_FROM_SCENE, type RemoveBallFromSceneEventPayload } from "~/constants/events";
import { ARENA_HEIGHT, ARENA_WIDTH, BALL_LABEL_REGEX, BALL_PROPERTIES, BALL_RADIUS, BOUNCE_THRESHOLD, FLOOR_LABEL_REGEX, SPEED_THRESHOLD, THROW_ANGLE, THROW_MAGNITUDE, WALL_AND_FLOOR_THICKNESS, WALL_PROPERTIES } from "~/features/arena/constants/arena";

const { Bodies, Body, Composite, Engine, Events, Render, Runner } = matterjs;

const applicationStore = useApplicationStore();
const { words, hasAudioFetchedForAllWords, isSocketConnected } = storeToRefs(applicationStore);

const ballsStore = useBallsStore();
const { sceneBalls } = storeToRefs(ballsStore);

const isEnvironmentReady = computed(() => {
    return hasAudioFetchedForAllWords.value && isSocketConnected.value;
});

const isSceneIdle = computed(() => sceneBalls.value.length === 0);

const eventAddRandomBall = useEventBus<AddRandomBallEventPayload>(ADD_RANDOM_BALL);
const eventBallHitWord = useEventBus<BallHitWordEventPayload>(BALL_HIT_WORD);
const eventHoverOnWord = useEventBus<HoverOnWordEventPayload>(HOVER_ON_WORD);
const eventRemoveBallFromScene = useEventBus<RemoveBallFromSceneEventPayload>(REMOVE_BALL_FROM_SCENE);

const { isSupported, memory } = useMemory();

const arena = ref<HTMLCanvasElement | undefined>(undefined);

const engine = Engine.create();
const world = engine.world;

watch(words, () => {
    if (!isEnvironmentReady.value) { return; }

    Composite.clear(world, false);
    Composite.add(world, getWalls());
});

function getWalls() {
    const FLOOR_SEGMENT_WIDTH = ARENA_WIDTH / words.value.length;

    const floorSegments: Matter.Body[] = [];
    words.value.forEach(({ id, word, color }, index) => {
        const segment = Bodies.rectangle(
            FLOOR_SEGMENT_WIDTH * index + FLOOR_SEGMENT_WIDTH / 2,
            ARENA_HEIGHT,
            FLOOR_SEGMENT_WIDTH,
            WALL_AND_FLOOR_THICKNESS,
            {
                isStatic: true,
                friction: 0.5,
                restitution: 0.8,
                label: `floor-segment-${id}-${word}`,
                render: {
                    fillStyle: chroma(color).alpha(0.2).hex(),
                    strokeStyle: color,
                    lineWidth: 1,
                },
            },
        );
        eventHoverOnWord.on(({ word: hoverWord, hover }) => {
            if (id === hoverWord.id) {
                segment.render.fillStyle = chroma(color).alpha(hover ? 1 : 0.2).hex();
            }
        });

        floorSegments.push(segment);
    });

    return [
        Bodies.rectangle(ARENA_WIDTH / 2, 0, ARENA_WIDTH, WALL_AND_FLOOR_THICKNESS, WALL_PROPERTIES),
        ...floorSegments,
        Bodies.rectangle(ARENA_WIDTH, ARENA_HEIGHT / 2, WALL_AND_FLOOR_THICKNESS, ARENA_HEIGHT, WALL_PROPERTIES),
        Bodies.rectangle(0, ARENA_HEIGHT / 2, WALL_AND_FLOOR_THICKNESS, ARENA_HEIGHT, WALL_PROPERTIES),
    ];
}

function removeBallFromScene(idOrBall: string | Matter.Body) {
    const ball = typeof idOrBall === "string" ? Composite.allBodies(world).find(body => body.label === `ball-${idOrBall}`) : idOrBall;
    if (!ball) { return; }

    Composite.remove(world, ball);
    const ballMatch = ball.label.match(BALL_LABEL_REGEX);
    if (ballMatch) {
        eventBallHitWord.emit({
            ball: ballMatch.groups!.id,
            word: null,
        });

        ballsStore.manageSceneBall(ballMatch.groups!.id, "remove");
    }
}

eventRemoveBallFromScene.on((data) => {
    if (!isEnvironmentReady.value) { return; }
    removeBallFromScene(data.ball);
});

eventAddRandomBall.on((data) => {
    if (!isEnvironmentReady.value) { return; }

    const _id = ulid();

    const ball = Bodies.circle(
        Math.random() * ARENA_WIDTH / 2 + ARENA_WIDTH / 4,
        480 * (Math.random() * 0.08 + 0.05),
        data.radius || BALL_RADIUS,
        {
            ...BALL_PROPERTIES,
            label: `ball-${_id}`,
            render: {
                fillStyle: colorHash(_id).hex(),
            },
        },
    );

    ballsStore.manageSceneBall(_id, "add");

    const angle = THROW_ANGLE * (Math.random() * 0.5 + 0.25);
    const force = {
        x: THROW_MAGNITUDE * Math.cos(angle) * (Math.random() < 0.5 ? 1 : -1),
        y: THROW_MAGNITUDE * Math.sin(angle),
    };

    Body.applyForce(ball, ball.position, force);

    Composite.add(world, ball);

    const checkBallAtRest = () => {
        const velocity = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
        const isBouncing = Math.abs(ball.velocity.y) > BOUNCE_THRESHOLD;

        if (velocity < SPEED_THRESHOLD && !isBouncing) {
            removeBallFromScene(ball);
            Events.off(engine, "afterUpdate", checkBallAtRest);
        }
    };

    Events.on(engine, "afterUpdate", checkBallAtRest);
});

eventBallHitWord.on((payload) => {
    if (!isEnvironmentReady.value) { return; }
    ballsStore.recordHit(payload.ball, payload.word || "destroyed");
});

onMounted(async () => {
    await nextTick();

    const render = Render.create({
        canvas: arena.value,
        engine,
        options: {
            background: "transparent",
            width: ARENA_WIDTH,
            height: ARENA_HEIGHT,
            wireframeBackground: "transparent",
            wireframes: false,
        },
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    Composite.add(world, getWalls());

    Events.on(engine, "collisionStart", (event) => {
        const pairs = event.pairs;

        pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;

            const ball = bodyA.label.match(BALL_LABEL_REGEX) ? bodyA : bodyB.label.match(BALL_LABEL_REGEX) ? bodyB : null;
            const floor = bodyA.label.match(FLOOR_LABEL_REGEX) ? bodyA : bodyB.label.match(FLOOR_LABEL_REGEX) ? bodyB : null;

            if (ball && floor) {
                const ballMatch = ball.label.match(BALL_LABEL_REGEX);
                const floorMatch = floor.label.match(FLOOR_LABEL_REGEX);

                if (ballMatch && floorMatch) {
                    if (isEnvironmentReady.value) {
                        const normal = { x: 0, y: -1 }; // Normal vector of the floor
                        const velocity = ball.velocity;
                        const dotProduct = velocity.x * normal.x + velocity.y * normal.y;
                        const magnitudeVelocity = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
                        const magnitudeNormal = Math.sqrt(normal.x ** 2 + normal.y ** 2);
                        const angle = Math.acos(dotProduct / (magnitudeVelocity * magnitudeNormal)) * (180 / Math.PI);

                        const BOUNCE_ANGLE_THRESHOLD = 130;

                        if (angle > BOUNCE_ANGLE_THRESHOLD) {
                            eventBallHitWord.emit({
                                ball: ballMatch.groups!.id,
                                word: applicationStore.getWordData(floorMatch.groups!.id),
                            });
                        }
                    }
                }
            }
        });
    });
});
</script>

<template>
    <div class=":uno: relative flex flex-col overflow-clip border border-dark-300 rounded-xl bg-dark-600 shadow-md">
        <ClientOnly>
            <template #fallback>
                <div class=":uno: min-h-480px min-w-854px flex flex-col items-center justify-center">
                    <div class=":uno: flex flex-col animate-pulse items-center justify-center">
                        <Icon name="i-svg-spinners:3-dots-fade" />
                        <div class=":uno: mt-1 text-sm text-gray-500">
                            Loading scene...
                        </div>
                    </div>
                </div>
            </template>

            <template #default>
                <div class=":uno: relative overflow-clip border-b border-dark-300 bg-dark-900 shadow-sm">
                    <div class=":uno: [--x-dot-color:red] absolute inset-0">
                        <div class=":uno: bg-pattern [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent)] size-full op-60" />
                    </div>

                    <canvas ref="arena" class=":uno: relative" />

                    <Transition mode="out-in" name="fade">
                        <div v-if="!isEnvironmentReady" class=":uno: absolute inset-0 flex flex-col select-none items-center justify-center bg-dark-200/10 backdrop-blur-xl">
                            <Icon name="i-svg-spinners:3-dots-fade" />
                            <div class=":uno: mt-1 text-center text-sm text-gray-500">
                                <Transition mode="out-in" name="fade">
                                    <span v-if="!hasAudioFetchedForAllWords">
                                        Fetching audio for words...
                                    </span>
                                    <span v-else-if="!isSocketConnected">
                                        Connecting to server...
                                    </span>
                                </Transition>
                                <br>
                                <span class=":uno: animate-pulse text-xs">
                                    If this takes too long, please refresh the page.
                                </span>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class=":uno: h-8 flex select-none items-center justify-between gap-x-4 px-10px text-xs text-gray-500">
                    <div>
                        Press <kbd class=":uno: border border-dark-100 rounded-md bg-dark-300 px-1 pt-0.5 font-medium leading-none uppercase">Space</kbd> to add a random ball to the scene.
                    </div>

                    <div class=":uno: flex items-center gap-x-2">
                        <div class=":uno: leading-none">
                            <span>Scene:</span> {{ isSceneIdle ? "Idle" : "Active" }}
                        </div>

                        <div class=":uno: size-1 rounded-full bg-dark-300" />

                        <div v-if="isSupported && memory" class=":uno: flex gap-x-2">
                            <div class=":uno: leading-none">
                                <span>Page Memory:</span> {{ prettyBytes(memory.usedJSHeapSize) }} / {{ prettyBytes(memory.totalJSHeapSize) }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="false" :style="{ gridTemplateColumns: `repeat(${words.length}, 1fr)` }" class=":uno: grid select-none px-10px">
                    <template v-for="{ word, id: _id, status } in words" :key="_id">
                        <div :class="{ ':uno: animate-pulse-alt': status === 'fetching' }" class=":uno: h-8 flex items-center justify-center font-semibold">
                            <div :class="{ ':uno: bg-dark-200 scale-90 text-gray-500': status === 'idle', ':uno: bg-teal-900 text-gray-300 scale-100': status === 'available' }" class=":uno: rounded-md px-1.5 pb-1.2 pt-1.5 text-10px leading-none uppercase transition">
                                {{ word }}
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </ClientOnly>
    </div>
</template>

<style lang="scss" scoped>
.bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='rgb(80,80,80)' id='pattern-circle' cx='10' cy='10' r='1.6257413380501518'%3E%3C/circle%3E%3C/svg%3E");
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
