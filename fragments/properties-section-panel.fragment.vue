<script lang="ts" setup>
import { ADD_RANDOM_BALL, type AddRandomBallEventPayload } from "~/constants/events";

const eventAddRandomBall = useEventBus<AddRandomBallEventPayload>(ADD_RANDOM_BALL);

const applicationStore = useApplicationStore();
const { phrase, hasAudioFetchedForAllWords } = storeToRefs(applicationStore);

const ballsStore = useBallsStore();
const { sceneBalls, isClearingScene } = storeToRefs(ballsStore);

const isEnvironmentReady = computed(() => {
    return hasAudioFetchedForAllWords.value;
});

const isSceneIdle = computed(() => sceneBalls.value.length === 0);

const localPhrase = ref(phrase.value);
</script>

<template>
    <SectionPanel heading="Properties">
        <div class=":uno: px-3 pb-3 pt-2">
            <div class=":uno: flex items-stretch gap-x-3">
                <div class=":uno: grow">
                    <div class=":uno: flex flex-col">
                        <div class=":uno: h-5 flex items-center text-2.5 text-gray-500 font-semibold uppercase">
                            Phrase
                        </div>

                        <div class=":uno: mt-1 h-8 flex items-center">
                            <input
                                v-model="localPhrase"
                                :disabled="!isEnvironmentReady || !isSceneIdle || isClearingScene"
                                class=":uno: h-8 flex grow border border-dark-300 rounded-lg bg-dark-400 px-3 py-2 text-sm text-gray-300 font-medium outline-none transition disabled:(pointer-events-none op-40) focus:(border-teal-900 bg-dark-600 shadow-md shadow-inset ring-1 ring-teal-900/50) hover:(border-dark-200 bg-dark-300)"
                                placeholder="Enter a phrase"
                                @keydown.enter.prevent="phrase = localPhrase"
                            >

                            <button
                                :disabled="!isEnvironmentReady || !isSceneIdle || isClearingScene"
                                class=":uno: ml-2 h-8 flex items-center justify-center border border-teal-800 rounded-lg bg-teal-900 px-3 text-sm text-gray-300 font-medium leading-none outline-none transition disabled:(pointer-events-none op-40) active:(border-teal-800 bg-teal-900 shadow-lg shadow-inset) hover:(border-teal-700 bg-teal-800)"
                                @click="phrase = localPhrase"
                            >
                                Set Phrase
                            </button>
                        </div>

                        <div class=":uno: mt-2 text-xs text-gray-500 font-medium leading-none italic">
                            You can only change phrase when scene is idle.
                        </div>
                    </div>
                </div>

                <div class=":uno: flex flex-col">
                    <div class=":uno: h-5 flex" />
                    <div class=":uno: mt-1 h-8 flex items-center justify-center">
                        <div class=":uno: h-4 w-px rounded-full bg-dark-200" />
                    </div>
                </div>

                <div class=":uno: shrink-0">
                    <div class=":uno: h-5 flex" />
                    <div class=":uno: mt-1 h-8 flex items-center justify-center">
                        <button
                            :disabled="!isEnvironmentReady"
                            class=":uno: h-8 flex items-center justify-center border border-blue-800 rounded-lg bg-blue-900 px-3 text-sm text-gray-300 font-medium leading-none outline-none transition disabled:(pointer-events-none op-40) active:(border-blue-800 bg-blue-900 shadow-lg shadow-inset) hover:(border-blue-700 bg-blue-800)"
                            @click="eventAddRandomBall.emit({})"
                        >
                            <Icon class=":uno: mr-1 size-4.5" name="i-ic:baseline-sports-baseball" />
                            Throw Random Ball
                        </button>
                    </div>
                </div>

                <div class=":uno: flex flex-col">
                    <div class=":uno: h-5 flex" />
                    <div class=":uno: mt-1 h-8 flex items-center justify-center">
                        <div class=":uno: h-4 w-px rounded-full bg-dark-200" />
                    </div>
                </div>
                <div class=":uno: shrink-0">
                    <div class=":uno: h-5 flex" />
                    <div class=":uno: mt-1 h-8 flex items-center justify-center">
                        <button
                            :disabled="isClearingScene || !isEnvironmentReady"
                            class=":uno: h-8 flex items-center justify-center border border-red-800 rounded-lg bg-red-900 px-3 text-sm text-gray-300 font-medium leading-none outline-none transition disabled:(pointer-events-none op-40) active:(border-red-800 bg-red-900 shadow-lg shadow-inset) hover:(border-red-700 bg-red-800)"
                            @click="ballsStore.clearScene()"
                        >
                            <Icon v-if="isClearingScene" class=":uno: mr-1 size-4.3" name="i-svg-spinners:180-ring-with-bg" />
                            <Icon v-else class=":uno: mr-1 size-4.3" name="i-lucide:refresh-ccw" />
                            Clear Scene
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </SectionPanel>
</template>
