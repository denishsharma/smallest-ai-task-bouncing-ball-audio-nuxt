import { faker } from "@faker-js/faker";
import ColorHash from "color-hash";
import { ulid } from "ulidx";

import type { WordData } from "~/types/application";
import type { BallRecord } from "~/types/balls";

const colorHash = new ColorHash();

export const useBallsStore = defineStore("balls", () => {
    const internalBalls = ref<string[]>([]);
    const hits = ref<Record<string, ({ id: string; word: WordData } | "destroyed")[]>>({});
    const audios = ref<Record<string, string>>({});

    const balls = computed<BallRecord[]>(() => {
        return internalBalls.value.map((ball) => {
            return {
                id: ball,
                name: `${faker.person.firstName()} ${faker.person.lastName()}'s ball`,
                color: colorHash.hex(ball),
                hits: hits.value[ball] || [],
                audio: audios.value[ball] || null,
            };
        });
    });

    function recordHit(ball: string, data: WordData | "destroyed") {
        if (!hits.value[ball]) {
            internalBalls.value.unshift(ball);
            hits.value[ball] = [];
        }

        hits.value[ball].push(typeof data === "string" ? "destroyed" : { id: ulid(), word: data });
    }

    function addAudio(ball: string, audio: string) {
        audios.value[ball] = audio;
    }

    return {
        balls,
        hits,
        audios,
        recordHit,
        addAudio,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBallsStore, import.meta.hot));
}
