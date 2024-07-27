import type { EventBusKey } from "@vueuse/core";

export interface SceneAddBallEventPayload { radius?: number }

export const SCENE_ADD_RANDOM_BALL: EventBusKey<SceneAddBallEventPayload> = Symbol("scene-add-random-ball");

export interface SceneBallHitFloorEventPayload {
    ball: string;
    floor: { id: string; word: string };
}

export const SCENE_BALL_HIT_FLOOR: EventBusKey<SceneAddBallEventPayload> = Symbol("scene-ball-hit-floor");
