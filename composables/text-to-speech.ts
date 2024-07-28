import { destr } from "destr";

const { send, data: wsData } = useWebSocket("wss://asr.iitm.ac.in/demo/ws/tts/english/male");

export function useFetchWordAudio(word: string) {
    return new Promise<string>((resolve) => {
        send(word);
        const unwatch = watch(wsData, (value) => {
            const { audio } = destr<{ audio: string }>(value);
            resolve(audio);
            unwatch();
        });
    });
}
