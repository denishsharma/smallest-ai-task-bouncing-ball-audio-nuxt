<script lang="ts" setup>
import { Collapse } from "vue-collapsed";

import { ADD_RANDOM_BALL, type AddRandomBallEventPayload, BALL_AUDIO_RECEIVED, BALL_HIT_WORD, type BallAudioReceivedEventPayload, type BallHitWordEventPayload } from "~/constants/events";
import { sendBallHitFloor } from "~/services/socket";

definePageMeta({
    layout: "app",
    colorMode: "dark",
});

useHead({
    meta: [
        {
            name: "author",
            content: "Denish Sharma",
        },
    ],
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

const isTaskDescriptionExpanded = ref(false);

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
        <div class=":uno: mx-a mb-4 max-w-854px w-full flex flex-col">
            <div class=":uno: flex flex-col overflow-clip border border-dark-300 rounded-xl shadow-sm divide-y divide-dark-300">
                <div class=":uno: relative shrink-0 bg-dark-600 px-1.5 py-2">
                    <div class=":uno: absolute inset-0">
                        <div class=":uno: absolute h-full w-4/12 from-teal-900/20 to-transparent bg-gradient-to-r <md:(from-teal-900/50)" />
                    </div>

                    <div class=":uno: relative flex items-stretch justify-between gap-x-8">
                        <div class=":uno: flex items-center py-0.5 pl-2">
                            <div class=":uno: size-8 flex shrink-0 select-none items-center justify-center rounded-lg bg-teal-600 text-sm font-bold leading-none">
                                <Icon class=":uno: size-6" name="i-svg-spinners:wind-toy" />
                            </div>

                            <div class=":uno: ml-3 h-full flex flex-col select-none justify-center gap-y-1 leading-none">
                                <div class=":uno: text-sm font-medium leading-none <md:(text-xs)">
                                    Bouncing Ball Audio - Task by smallest.ai
                                </div>

                                <div class=":uno: text-xs text-light-50/60 leading-none">
                                    By
                                    <NuxtLink
                                        :external="true"
                                        class=":uno: underline-text-gray-600 cursor-pointer underline underline-dashed transition hover:(text-light-50)"
                                        target="_blank"
                                        to="https://github.com/denishsharma"
                                    >
                                        Denish Sharma
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>

                        <div class=":uno: flex items-center justify-end gap-x-2">
                            <div class=":uno: flex items-stretch gap-x-0.5">
                                <NuxtLink
                                    :external="true"
                                    class=":uno: size-9 flex cursor-pointer items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200)"
                                    target="_blank"
                                    to="https://www.linkedin.com/in/denishsharma/"
                                >
                                    <Icon class=":uno: size-4.5" name="i-mynaui:brand-linkedin" />
                                </NuxtLink>

                                <NuxtLink
                                    :external="true"
                                    class=":uno: size-9 flex cursor-pointer items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200)"
                                    target="_blank"
                                    to="https://github.com/denishsharma/smallest-ai-task-bouncing-ball-audio-nuxt"
                                >
                                    <Icon class=":uno: size-4.5" name="i-mynaui:brand-github" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>

                <div class=":uno: px-4 py-4 text-sm">
                    <div class=":uno: flex flex-col">
                        <div class=":uno: mb-3 text-sm text-gray-500 font-semibold">
                            Task Description
                        </div>

                        <Collapse :base-height="80" :when="isTaskDescriptionExpanded" class=":uno: flex flex-col text-sm text-gray-400 data-[collapse='collapsed']:([mask:linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_80%)]) space-y-5">
                            <p>
                                Create a 2D arena with downward gravity where there will be a ball that is spawned at a random height below the roof of the arena on the click of a button and gets a
                                small
                                random
                                horizontal force. The floor should have a dampening effect such that the ball eventually will come to a halt after hitting the floor multiple times. The side walls and
                                the
                                roof
                                are
                                perfectly elastic.
                            </p>

                            <p>
                                The floor is divided into 8 horizontal panes, each having audio "I", "am", "an", "amazing", "frontend", "developer", "at", "night" respectively. Whenever the ball
                                bounces
                                on a
                                pane, the audio corresponding to the particular pane should be generated and sent to the backend. This audio can also be pre-generated using any free text to speech
                                apis.
                            </p>

                            <p>
                                In the backend, starting from the first audio to be sent to the last one, the audio will be concatenated together. Finally, once the ball is done bouncing, send the
                                entire
                                audio
                                back to the frontend where it should be available for playing in the UI/download.
                            </p>
                        </Collapse>

                        <button class=":uno: mt-3 flex cursor-pointer items-center gap-x-2 bg-transparent text-sm text-teal-600 transition hover:(text-teal-700)" @click="isTaskDescriptionExpanded = !isTaskDescriptionExpanded">
                            Show more
                        </button>
                    </div>

                    <div class=":uno: mt-4 border-t border-dark-300 pt-4">
                        <div class=":uno: flex items-center gap-x-3">
                            <NuxtLink
                                :external="true"
                                class=":uno: flex cursor-pointer items-center gap-x-2 bg-transparent text-sm text-cyan-600 underline underline-dashed transition hover:(text-cyan-700)"
                                target="_blank"
                                to="https://github.com/denishsharma/smallest-ai-task-bouncing-ball-audio-nuxt"
                            >
                                Frontend Repository
                            </NuxtLink>

                            <div class=":uno: h-4 w-px bg-dark-300" />

                            <NuxtLink
                                :external="true"
                                class=":uno: flex cursor-pointer items-center gap-x-2 bg-transparent text-sm text-cyan-600 underline underline-dashed transition hover:(text-cyan-700)"
                                target="_blank"
                                to="https://github.com/denishsharma/smallest-ai-task-bouncing-ball-audio-adonis"
                            >
                                Backend Repository
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
