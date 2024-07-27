import { hash } from "ohash";

import type { WordData } from "~/types/application";

export const useApplicationStore = defineStore("app", () => {
    const phrase = ref<string>("Convert Base64 to Audio online using a free decoder tool which allows you to decode Base64 as sound file and play it directly in the browser");

    const fetchQueue = ref<string[]>([]);
    const audios = ref<Record<string, string>>({});

    const words = computed<WordData[]>(() => {
        return phrase.value.split(" ").map((word, index) => {
            const _hash = hash(word);
            return {
                id: hash(`${_hash}-${index}`),
                word: word.trim(),
                hash: _hash,
                status: fetchQueue.value.includes(_hash) ? "fetching" : audios.value[_hash] ? "available" : "idle",
            };
        });
    });

    function getWordData(id: string): WordData {
        const word = words.value.find(word => word.id === id);
        if (!word) throw new Error("Word not found");

        return word;
    }

    async function getAudioOfWord(id: string) {
        const word = getWordData(id);

        const _hash = word.hash;
        if (audios.value[_hash]) { return audios.value[_hash]; }

        if (fetchQueue.value.includes(_hash)) {
            return await new Promise<string>((resolve) => {
                const unwatch = watch(audios, (value) => {
                    if (value[_hash]) {
                        resolve(value[_hash]);
                        fetchQueue.value.splice(fetchQueue.value.indexOf(_hash), 1);
                        unwatch();
                    }
                });
            });
        }

        fetchQueue.value.push(_hash);

        const audio = await useFetchWordAudio(word.word);
        audios.value[_hash] = audio;
        fetchQueue.value.splice(fetchQueue.value.indexOf(_hash), 1);

        return audio;
    }

    return {
        phrase,
        words,
        audios,
        getAudioOfWord,
        getWordData,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useApplicationStore, import.meta.hot));
}
