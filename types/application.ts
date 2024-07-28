export interface WordData {
    id: string;
    word: string;
    hash: string;
    color: string;
    status: "fetching" | "available" | "idle";
}
