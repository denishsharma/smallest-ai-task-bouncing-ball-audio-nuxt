<script lang="ts" setup>
import WaveSurfer from "wavesurfer.js";

import type { WordData } from "~/types/application";
import type { BallRecord } from "~/types/balls";

import { HOVER_ON_WORD, type HoverOnWordEventPayload } from "~/constants/events";

const props = defineProps<{
    record: BallRecord;
}>();

const wordHits = computed(() => {
    return props.record.hits.filter(hit => hit !== "destroyed");
});

const doesBallDestroyWord = computed(() => {
    return props.record.hits.includes("destroyed");
});

const hoveredWord = ref<WordData | null>(null);
const eventHoverOnWord = useEventBus<HoverOnWordEventPayload>(HOVER_ON_WORD);

eventHoverOnWord.on(({ word, hover }) => {
    hoveredWord.value = hover ? word : null;
});

const isMounted = useMounted();
const visualizerRootElement = ref<HTMLDivElement | null>(null);
const waveSurfer = ref<WaveSurfer | null>(null);
const isPlaying = ref(false);

watchImmediate(() => props.record.audio, (value) => {
    if (value === null) { return; }
    if (!isMounted.value) { return; }
    if (!visualizerRootElement.value) { return; }

    waveSurfer.value = WaveSurfer.create({
        container: visualizerRootElement.value,
        height: 24,
        width: 180,
        waveColor: "#404040",
        progressColor: props.record.color,
        cursorWidth: 2,
        interact: false,
        barWidth: 3,
        barRadius: 10,
        barGap: 2,
    });

    waveSurfer.value.loadBlob(base64ToBlob(value, "audio/wav"));

    waveSurfer.value.on("play", () => {
        isPlaying.value = true;
    });

    waveSurfer.value.on("pause", () => {
        isPlaying.value = false;
    });

    waveSurfer.value.on("finish", () => {
        isPlaying.value = false;
        waveSurfer.value?.stop();
    });

    waveSurfer.value.on("destroy", () => {
        isPlaying.value = false;
    });

    waveSurfer.value.on("interaction", () => {
        waveSurfer.value?.play();
    });
});

function togglePlayState() {
    if (!waveSurfer.value) { return; }

    if (isPlaying.value) {
        waveSurfer.value.stop();
    } else {
        waveSurfer.value.play();
    }
}
</script>

<template>
    <div :class="{ ':uno: animate-pulse': !doesBallDestroyWord }" class=":uno: w-full flex flex-col">
        <div class=":uno: h-8 flex items-stretch justify-between gap-x-2">
            <div class=":uno: flex grow items-center">
                <div class=":uno: flex items-center">
                    <div :style="{ backgroundColor: record.color }" class=":uno: size-7 flex items-center justify-center rounded-full shadow-lg">
                        <Icon class=":uno: size-5" name="i-ic:baseline-sports-baseball" />
                    </div>

                    <div class=":uno: ml-2 flex flex-col gap-y-1">
                        <div class=":uno: mt-0.5 text-xs text-gray-300 font-semibold leading-none">
                            {{ record.name }}
                        </div>

                        <div class=":uno: flex items-center gap-x-2 text-2.5 text-gray-500 font-medium leading-none uppercase">
                            <span>
                                #{{ record.id }}
                            </span>

                            <div class=":uno: size-1 shrink-0 rounded-full bg-dark-100" />

                            <span>
                                Hits: {{ wordHits.length }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class=":uno: flex shrink-0 items-center -mr-1.5">
                <template v-if="doesBallDestroyWord">
                    <div v-show="record.audio !== null" ref="visualizerRootElement" class=":uno: mr-2" />

                    <button :disabled="record.audio === null" class=":uno: active:inset size-7 flex items-center justify-center border border-transparent rounded-full bg-transparent outline-none transition disabled:(pointer-events-none op-40) active:(border-dark-200 bg-dark-400 shadow-md) hover:(border-dark-200 bg-dark-300 shadow-sm)" @click="togglePlayState">
                        <Icon v-if="props.record.audio === null" class=":uno: size-4 text-gray-500" name="i-svg-spinners:180-ring-with-bg" />
                        <Icon v-else-if="isPlaying" class=":uno: size-4 animate-pulse text-gray-500" name="i-lucide:circle-stop" />
                        <Icon v-else class=":uno: size-4 text-gray-500" name="i-lucide:circle-play" />
                    </button>
                </template>

                <template v-else>
                    <div class=":uno: size-7 flex items-center justify-center pr-0.5">
                        <Icon class=":uno: size-7 text-gray-300" name="i-svg-spinners:bouncing-ball" />
                    </div>
                </template>
            </div>
        </div>

        <div class=":uno: mt-4 flex flex-wrap gap-1.5 pr-4">
            <div
                v-for="hit in wordHits"
                :key="hit.id"
                :class="{ ':uno: op-40': hoveredWord ? hit.word.id !== hoveredWord?.id : false }"
                class=":uno: min-h-5.3 flex overflow-clip border rounded-md transition divide-x dark:(border-dark-100 bg-dark-300 divide-dark-100)"
            >
                <div :style="{ backgroundColor: hit.word.color }" class=":uno: w-1 shrink-0" />

                <div class=":uno: flex items-center px-2 text-2.5 text-gray-300 font-semibold leading-none uppercase">
                    {{ hit.word.word }}
                </div>
            </div>
        </div>
    </div>
</template>
