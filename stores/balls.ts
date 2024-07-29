import { faker } from "@faker-js/faker";
import { ulid } from "ulidx";

import type { WordData } from "~/types/application";
import type { BallRecord } from "~/types/balls";

import { REMOVE_BALL_FROM_SCENE, type RemoveBallFromSceneEventPayload } from "~/constants/events";

export const useBallsStore = defineStore("balls", () => {
    const eventRemoveBallFromScene = useEventBus<RemoveBallFromSceneEventPayload>(REMOVE_BALL_FROM_SCENE);

    const sceneBalls = ref<string[]>([]);
    const isClearingScene = ref(false);
    const shouldStartClearingScene = ref(false);

    watch([() => shouldStartClearingScene.value, () => sceneBalls.value], ([_shouldStartClearingScene, _sceneBalls]) => {
        if (_sceneBalls.length === 0) {
            isClearingScene.value = false;
            shouldStartClearingScene.value = false;
            return;
        }

        if (_shouldStartClearingScene && _sceneBalls.length > 0) {
            isClearingScene.value = true;

            for (const ball of _sceneBalls) {
                eventRemoveBallFromScene.emit({ ball });
            }
        }
    }, { immediate: true });

    const internalBalls = ref<string[]>([]);
    const hits = ref<Record<string, ({ id: string; word: WordData } | "destroyed")[]>>({});
    const audios = ref<Record<string, string>>({});

    const balls = computed<BallRecord[]>(() => {
        return internalBalls.value.map((ball) => {
            return {
                id: ball,
                name: `${faker.person.firstName()} ${faker.person.lastName()}'s ball`,
                color: colorHash(ball).hex(),
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

    function manageSceneBall(ball: string, action: "add" | "remove") {
        if (action === "add") {
            sceneBalls.value = [...sceneBalls.value, ball];
        } else {
            sceneBalls.value = sceneBalls.value.filter(b => b !== ball);
        }
    }

    function clearScene() {
        shouldStartClearingScene.value = true;
    }

    return {
        sceneBalls,
        isClearingScene,
        balls,
        hits,
        audios,
        recordHit,
        addAudio,
        manageSceneBall,
        clearScene,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBallsStore, import.meta.hot));
}
