<script lang="ts" setup>
import type { WordData } from "~/types/application";

import { HOVER_ON_WORD, type HoverOnWordEventPayload, SCENE_ADD_RANDOM_BALL, SCENE_BALL_HIT_FLOOR, type SceneAddBallEventPayload, type SceneBallHitFloorEventPayload } from "~/constants/events";

definePageMeta({
    layout: "app",
});

const { $socket } = useNuxtApp();

const eventSceneAddRandomBall = useEventBus<SceneAddBallEventPayload>(SCENE_ADD_RANDOM_BALL);
const eventSceneBallHitFloor = useEventBus<SceneBallHitFloorEventPayload>(SCENE_BALL_HIT_FLOOR);
const eventHoverOnWord = useEventBus<HoverOnWordEventPayload>(HOVER_ON_WORD);

const { space } = useMagicKeys();

const applicationStore = useApplicationStore();
const { words } = storeToRefs(applicationStore);

whenever(space, () => {
    eventSceneAddRandomBall.emit({});
});

eventSceneBallHitFloor.on(async (data) => {
    console.log(data);

    if (data.floor === null) {
        $socket.emit("ball-hit-floor-end", data);
        return;
    }

    const audio = "abc";
    $socket.emit("ball-hit-floor", { ...data, audio });
});

function emitHoverOnWord(word: WordData, hover: boolean) {
    eventHoverOnWord.emit({ word, hover });
}
</script>

<template>
    <div class=":uno: grow py-14 dark:(bg-dark-800)">
        <div class=":uno: hide-scrollbars mx-a flex items-stretch overflow-x-scroll">
            <div class=":uno: w-10 shrink-0" />
            <div class=":uno: flex flex grow flex-col items-center">
                <ArenaFeature />
            </div>
            <div class=":uno: w-10 shrink-0" />
        </div>

        <div class=":uno: mt-4 px-4">
            <div class=":uno: mx-a max-w-854px w-full flex flex-col gap-y-4">
                <SectionPanel heading="Properties">
                    <div class=":uno: px-3 pb-3 pt-2">
                        qwewq
                    </div>
                </SectionPanel>

                <div class=":uno: flex gap-x-4">
                    <div class=":uno: min-w-70 shrink-0">
                        <SectionPanel heading="Individual Word">
                            <div class=":uno: flex flex-col divide-y dark:(divide-dark-300)">
                                <div
                                    v-for="word in words"
                                    :key="word.hash"
                                    class=":uno: h-10 flex items-center px-3 transition hover:(bg-dark-600)"
                                    @mouseenter="() => emitHoverOnWord(word, true)"
                                    @mouseleave="() => emitHoverOnWord(word, false)"
                                >
                                    <IndividualWordFeature :word="word" />
                                </div>
                            </div>
                        </SectionPanel>
                    </div>

                    <div class=":uno: grow">
                        <SectionPanel heading="Ball Audio">
                            hello
                        </SectionPanel>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
