import ColorHash from "color-hash";
import { hash } from "ohash";

import type { WordData } from "~/types/application";

const colorHash = new ColorHash();

export const useApplicationStore = defineStore("app", () => {
    const phrase = ref<string>("I am an amazing frontend developer at night");

    const fetchQueue = ref<string[]>([]);
    const isFetching = ref<boolean>(false);
    const audios = ref<Record<string, string>>({});

    const words = computed<WordData[]>(() => {
        return phrase.value.split(" ").map((word, index) => {
            const _hash = hash(word.trim());
            return {
                id: hash(`${_hash}-${index}`),
                word: word.trim(),
                hash: _hash,
                color: colorHash.hex(_hash),
                status: fetchQueue.value.includes(_hash) ? "fetching" : audios.value[_hash] ? "available" : "idle",
            };
        });
    });

    const hasAudioFetchedForAllWords = computed(() => {
        return words.value.every(word => word.status === "available");
    });

    watchArray(words, async () => {
        if (isFetching.value) return;
        isFetching.value = true;

        for (const word of words.value) {
            if (audios.value[word.hash] || fetchQueue.value.includes(word.hash)) continue;

            fetchQueue.value.push(word.hash);
            audios.value[word.hash] = await useFetchWordAudio(word.word);
            fetchQueue.value = fetchQueue.value.filter(hash => hash !== word.hash);
        }

        isFetching.value = false;
    }, { immediate: true });

    function getWordData(id: string): WordData {
        const word = words.value.find(word => word.id === id);
        if (!word) throw new Error("Word not found");
        return word;
    }

    return {
        phrase,
        words,
        audios,
        hasAudioFetchedForAllWords,
        getWordData,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useApplicationStore, import.meta.hot));
}
