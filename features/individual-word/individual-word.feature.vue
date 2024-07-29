<script lang="ts" setup>
import WaveSurfer from "wavesurfer.js";

import type { WordData } from "~/types/application";

const props = defineProps<{
    word: WordData;
}>();

const applicationStore = useApplicationStore();
const { audios } = storeToRefs(applicationStore);

const word = computed(() => props.word.word);
const truncatedWord = computed(() => word.value.length > 12 ? `${word.value.slice(0, 12)}...` : word.value);

const audio = computed(() => {
    if (!Object.keys(audios.value).includes(props.word.hash)) { return null; }
    return audios.value[props.word.hash];
});

const isMounted = useMounted();
const visualizerRootElement = ref<HTMLDivElement | null>(null);
const waveSurfer = ref<WaveSurfer | null>(null);
const isPlaying = ref(false);

watchImmediate([() => audio.value, () => isMounted.value, () => visualizerRootElement.value], ([_audio, _isMounted, _visualizerRootElement]) => {
    if (_audio === null) { return; }
    if (!_isMounted) { return; }
    if (!_visualizerRootElement) { return; }

    waveSurfer.value = WaveSurfer.create({
        container: _visualizerRootElement,
        height: 24,
        width: 80,
        waveColor: "#404040",
        progressColor: props.word.color,
        cursorWidth: 2,
        interact: false,
        barWidth: 3,
        barRadius: 10,
        barGap: 2,
    });

    waveSurfer.value.loadBlob(base64ToBlob(_audio, "audio/wav"));

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
    <div class=":uno: min-h-8 w-full flex items-stretch justify-between gap-x-2">
        <div class=":uno: flex grow items-center">
            <div class=":uno: min-h-5.3 flex select-none overflow-clip border rounded-md divide-x dark:(border-dark-100 bg-dark-300 divide-dark-100)">
                <div :style="{ backgroundColor: props.word.color }" class=":uno: w-1 shrink-0" />

                <div class=":uno: max-w-30 flex items-center px-2 text-2.5 text-gray-300 font-semibold leading-none uppercase">
                    {{ truncatedWord }}
                </div>
            </div>
        </div>

        <div class=":uno: flex shrink-0 items-center -mr-1.5">
            <div v-show="audio !== null" ref="visualizerRootElement" class=":uno: mr-2" />

            <button :disabled="audio === null" class=":uno: active:inset size-7 flex items-center justify-center border border-transparent rounded-full bg-transparent outline-none transition disabled:(pointer-events-none op-40) active:(border-dark-200 bg-dark-400 shadow-md) hover:(border-dark-200 bg-dark-300 shadow-sm)" @click="togglePlayState">
                <Icon v-if="props.word.status === 'fetching'" class=":uno: size-4 text-gray-500" name="i-svg-spinners:180-ring-with-bg" />
                <Icon v-else-if="isPlaying" class=":uno: size-4 animate-pulse text-gray-500" name="i-lucide:circle-stop" />
                <Icon v-else class=":uno: size-4 text-gray-500" name="i-lucide:circle-play" />
            </button>
        </div>
    </div>
</template>
