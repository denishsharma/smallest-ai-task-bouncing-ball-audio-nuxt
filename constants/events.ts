import type { EventBusKey } from "@vueuse/core";
import type { WordData } from "~/types/application";

export interface SceneAddBallEventPayload { radius?: number }

export const SCENE_ADD_RANDOM_BALL: EventBusKey<SceneAddBallEventPayload> = Symbol("scene-add-random-ball");

export interface SceneBallHitFloorEventPayload {
    ball: string;
    floor: { id: string; word: WordData } | null;
}

export const SCENE_BALL_HIT_FLOOR: EventBusKey<SceneAddBallEventPayload> = Symbol("scene-ball-hit-floor");

export interface HoverOnWordEventPayload {
    hover: boolean;
    word: WordData;
}

export const HOVER_ON_WORD: EventBusKey<HoverOnWordEventPayload> = Symbol("hover-on-word");
