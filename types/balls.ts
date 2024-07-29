import type { WordData } from "~/types/application";

export interface BallRecord {
    id: string;
    name: string;
    color: string;
    hits: ({ id: string; word: WordData } | "destroyed")[];
    audio: string | null;
}
