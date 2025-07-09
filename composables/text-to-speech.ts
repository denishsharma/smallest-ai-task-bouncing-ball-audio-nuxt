import { destr } from "destr";

const { send, data: wsData } = useWebSocket("wss://asr.iitm.ac.in/demo/ws/tts/");

export function useFetchWordAudio(word: string) {
    const payload = {
        text: word,
        alpha: "1",
        language: "english",
        gender: "male",
    };
    return new Promise<string>((resolve) => {
        send(JSON.stringify(payload));
        const unwatch = watch(wsData, (value) => {
            const { audio } = destr<{ audio: string }>(value);
            resolve(audio);
            unwatch();
        });
    });
}
