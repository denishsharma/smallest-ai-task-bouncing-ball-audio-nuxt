<script lang="ts" setup>
import type { WordData } from "~/types/application";

import { ADD_RANDOM_BALL, type AddRandomBallEventPayload, BALL_AUDIO_RECEIVED, BALL_HIT_WORD, type BallAudioReceivedEventPayload, type BallHitWordEventPayload, HOVER_ON_WORD, type HoverOnWordEventPayload } from "~/constants/events";
import { sendBallHitFloor } from "~/services/socket";

definePageMeta({
    layout: "app",
    colorMode: "dark",
});

const eventAddRandomBall = useEventBus<AddRandomBallEventPayload>(ADD_RANDOM_BALL);
const eventBallHitFloor = useEventBus<BallHitWordEventPayload>(BALL_HIT_WORD);
const eventHoverOnWord = useEventBus<HoverOnWordEventPayload>(HOVER_ON_WORD);
const eventBallAudioReceived = useEventBus<BallAudioReceivedEventPayload>(BALL_AUDIO_RECEIVED);

const { space } = useMagicKeys({
    passive: false,
    onEventFired: (e) => {
        if (e.key === " ") {
            e.preventDefault();
        }
    },
});

const applicationStore = useApplicationStore();
const { words } = storeToRefs(applicationStore);

const ballsStore = useBallsStore();

whenever(space, () => {
    eventAddRandomBall.emit({});
});

eventBallHitFloor.on(async (data) => {
    if (data.word === null) {
        sendBallHitFloor(data.ball, null);
        return;
    }

    sendBallHitFloor(data.ball, {
        audio: applicationStore.getWordAudio(data.word.id),
        word: {
            text: data.word.word,
            hash: data.word.hash,
        },
    });
});

eventBallAudioReceived.on((data) => {
    ballsStore.addAudio(data.ball, data.audio);
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
                                    class=":uno: h-10 flex items-center px-3 transition hover:(bg-dark-500/50)"
                                    @mouseenter="() => emitHoverOnWord(word, true)"
                                    @mouseleave="() => emitHoverOnWord(word, false)"
                                >
                                    <IndividualWordFeature :word="word" />
                                </div>
                            </div>
                        </SectionPanel>
                    </div>

                    <div class=":uno: grow">
                        <BallsSectionPanelFragment />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
