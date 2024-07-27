export type ProcessTextToSpeechWorkerMessage = {
    direction: "to-worker";
    event: "process";
    text: string;
} | {
    direction: "from-worker";
    event: "processed";
    blob: Uint8Array;
};
