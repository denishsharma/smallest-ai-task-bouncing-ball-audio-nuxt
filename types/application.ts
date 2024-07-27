export interface WordData {
    id: string;
    word: string;
    hash: string;
    status: "fetching" | "available" | "idle";
}
