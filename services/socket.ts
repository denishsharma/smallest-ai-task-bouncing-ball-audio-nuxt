import { io } from "socket.io-client";

import { BALL_AUDIO_RECEIVED, type BallAudioReceivedEventPayload } from "~/constants/events";

const eventBallAudioReceived = useEventBus<BallAudioReceivedEventPayload>(BALL_AUDIO_RECEIVED);

export const socket = io(
    import.meta.env.PROD ? "https://smallest-ai-task-bouncing-ball-audio.onrender.com" : "http://localhost:3333",
    {
        withCredentials: true,
    },
);

socket.on("connect", () => {
    const applicationStore = useApplicationStore();
    const { isSocketConnected } = storeToRefs(applicationStore);
    isSocketConnected.value = true;
});

socket.on("disconnect", () => {
    const applicationStore = useApplicationStore();
    const { isSocketConnected } = storeToRefs(applicationStore);
    isSocketConnected.value = false;
});

socket.on("connect_error", (err) => {
    const applicationStore = useApplicationStore();
    const { isSocketConnected } = storeToRefs(applicationStore);
    isSocketConnected.value = false;
    console.error("Error connecting to socket, refresh page to try again", err);
});

socket.on("ball-audio", (data: { ball: string; audio: string }) => {
    eventBallAudioReceived.emit(data);
});

type BallHitFloorPayload = { audio: string; word: { text: string; hash: string } } | null;

export function sendBallHitFloor(ball: string, payload: BallHitFloorPayload) {
    if (!payload) {
        socket.emit("ball-hit-floor-end", { ball });
        return;
    }
    socket.emit("ball-hit-floor", { ball, ...payload });
}
