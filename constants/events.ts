import type { EventBusKey } from "@vueuse/core";
import type { WordData } from "~/types/application";

export interface AddRandomBallEventPayload { radius?: number }

export const ADD_RANDOM_BALL: EventBusKey<AddRandomBallEventPayload> = Symbol("add-random-ball");

export interface BallHitWordEventPayload {
    ball: string;
    word: WordData | null;
}

export const BALL_HIT_WORD: EventBusKey<BallHitWordEventPayload> = Symbol("ball-hit-word");

export interface HoverOnWordEventPayload {
    hover: boolean;
    word: WordData;
}

export const HOVER_ON_WORD: EventBusKey<HoverOnWordEventPayload> = Symbol("hover-on-word");

export interface BallAudioReceivedEventPayload {
    ball: string;
    audio: string;
}

export const BALL_AUDIO_RECEIVED: EventBusKey<BallAudioReceivedEventPayload> = Symbol("ball-audio-received");

export interface RemoveBallFromSceneEventPayload {
    ball: string;
}

export const REMOVE_BALL_FROM_SCENE: EventBusKey<RemoveBallFromSceneEventPayload> = Symbol("remove-ball-from-scene");
