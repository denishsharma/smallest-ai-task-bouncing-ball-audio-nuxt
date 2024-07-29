<script lang="ts" setup>
import { ADD_RANDOM_BALL, type AddRandomBallEventPayload, BALL_AUDIO_RECEIVED, BALL_HIT_WORD, type BallAudioReceivedEventPayload, type BallHitWordEventPayload } from "~/constants/events";
import { sendBallHitFloor } from "~/services/socket";

definePageMeta({
    layout: "app",
    colorMode: "dark",
});

const eventAddRandomBall = useEventBus<AddRandomBallEventPayload>(ADD_RANDOM_BALL);
const eventBallHitFloor = useEventBus<BallHitWordEventPayload>(BALL_HIT_WORD);

const eventBallAudioReceived = useEventBus<BallAudioReceivedEventPayload>(BALL_AUDIO_RECEIVED);

const activeElement = useActiveElement();
const notUsingInput = computed(() => activeElement.value?.tagName !== "INPUT" && activeElement.value?.tagName !== "TEXTAREA");
const { space } = useMagicKeys({
    passive: false,
    onEventFired: (e) => {
        if (e.key === " ") {
            if (notUsingInput.value) {
                e.preventDefault();
            }
        }
    },
});

const applicationStore = useApplicationStore();

const ballsStore = useBallsStore();

whenever(logicAnd(space, notUsingInput), () => {
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
</script>

<template>
    <div class=":uno: relative grow py-14 dark:(bg-dark-800)">
        <div class=":uno: hide-scrollbars mx-a flex items-stretch overflow-x-scroll">
            <div class=":uno: w-10 shrink-0" />
            <div class=":uno: flex flex grow flex-col items-center">
                <ArenaFeature />
            </div>
            <div class=":uno: w-10 shrink-0" />
        </div>

        <div class=":uno: mt-4 px-4">
            <div class=":uno: mx-a max-w-854px w-full flex flex-col gap-y-4">
                <PropertiesSectionPanelFragment />

                <div class=":uno: flex gap-x-4">
                    <div class=":uno: sticky top-4 min-w-70 shrink-0 self-start">
                        <IndividualWordSectionPanelFragment />
                    </div>

                    <div class=":uno: grow">
                        <BallsSectionPanelFragment />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
