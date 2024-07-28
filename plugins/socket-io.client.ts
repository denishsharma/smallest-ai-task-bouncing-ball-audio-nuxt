import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
    const socket = io("http://localhost:3333", {
        withCredentials: true,
    });

    socket.on("connection", () => {
        console.log("Connected to server");
    });

    socket.on("ball-audio", (data) => {
        console.log("Received audio data", data);
    });

    return {
        provide: {
            socket,
        },
    };
});
