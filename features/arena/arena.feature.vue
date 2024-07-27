<script lang="ts" setup>
import { Bodies, Body, Composite, Engine, Events, Render, Runner } from "matter-js";
import { ulid } from "ulidx";

import { ARENA_HEIGHT, ARENA_WIDTH, BALL_LABEL_REGEX, BALL_PROPERTIES, BALL_RADIUS, BOUNCE_THRESHOLD, FLOOR_LABEL_REGEX, SPEED_THRESHOLD, THROW_ANGLE, THROW_MAGNITUDE, WALL_AND_FLOOR_THICKNESS, WALL_PROPERTIES } from "~/features/arena/constants/arena";
import { SCENE_ADD_RANDOM_BALL, SCENE_BALL_HIT_FLOOR, type SceneAddBallEventPayload, type SceneBallHitFloorEventPayload } from "~/features/arena/constants/events";

const applicationStore = useApplicationStore();
const { words } = storeToRefs(applicationStore);

const eventSceneAddRandomBall = useEventBus<SceneAddBallEventPayload>(SCENE_ADD_RANDOM_BALL);
const eventSceneBallHitFloor = useEventBus<SceneBallHitFloorEventPayload>(SCENE_BALL_HIT_FLOOR);

const arena = ref<HTMLCanvasElement | undefined>(undefined);

const engine = Engine.create();
const world = engine.world;

function getWalls() {
    const FLOOR_SEGMENT_WIDTH = ARENA_WIDTH / words.value.length;

    const floorSegments: Body[] = [];
    words.value.forEach(({ id, word }, index) => {
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
            },
        );

        floorSegments.push(segment);
    });

    return [
        Bodies.rectangle(ARENA_WIDTH / 2, 0, ARENA_WIDTH, WALL_AND_FLOOR_THICKNESS, WALL_PROPERTIES),
        ...floorSegments,
        Bodies.rectangle(ARENA_WIDTH, ARENA_HEIGHT / 2, WALL_AND_FLOOR_THICKNESS, ARENA_HEIGHT, WALL_PROPERTIES),
        Bodies.rectangle(0, ARENA_HEIGHT / 2, WALL_AND_FLOOR_THICKNESS, ARENA_HEIGHT, WALL_PROPERTIES),
    ];
}

eventSceneAddRandomBall.on((data) => {
    const ball = Bodies.circle(
        Math.random() * ARENA_WIDTH / 2 + ARENA_WIDTH / 4,
        480 * (Math.random() * 0.08 + 0.05),
        data.radius || BALL_RADIUS,
        {
            ...BALL_PROPERTIES,
            label: `ball-${ulid()}`,
        },
    );

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
            Composite.remove(world, ball);
            const ballMatch = ball.label.match(BALL_LABEL_REGEX);
            if (ballMatch) {
                eventSceneBallHitFloor.emit({
                    ball: ballMatch.groups!.id,
                    floor: null,
                });
            }
            Events.off(engine, "afterUpdate", checkBallAtRest);
        }
    };

    Events.on(engine, "afterUpdate", checkBallAtRest);
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
                    eventSceneBallHitFloor.emit({
                        ball: ballMatch.groups!.id,
                        floor: {
                            id: floorMatch.groups!.id,
                            word: applicationStore.getWordData(floorMatch.groups!.id),
                        },
                    });
                }
            }
        });
    });
});
</script>

<template>
    <div class=":uno: relative flex flex-col overflow-clip border border-dark-300 rounded-xl bg-dark-800 shadow-md">
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
                <div class=":uno: relative size-full overflow-clip border-b border-dark-300 rounded-b-xl bg-dark-900 shadow-sm">
                    <div class=":uno: [--x-dot-color:red] absolute inset-0">
                        <div class=":uno: bg-pattern [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent)] size-full op-60" />
                    </div>

                    <canvas ref="arena" class=":uno: relative" />
                </div>

                <div :style="{ gridTemplateColumns: `repeat(${words.length}, 1fr)` }" class=":uno: grid select-none px-10px">
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
</style>
