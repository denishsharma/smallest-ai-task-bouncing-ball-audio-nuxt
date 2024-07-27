import { destr } from "destr";

const { send, data: wsData } = useWebSocket("wss://asr.iitm.ac.in/demo/ws/tts/english/male");

export function useFetchWordAudio(word: string) {
    send(word);

    return new Promise<string>((resolve) => {
        const unwatch = watch(wsData, (value) => {
            const { audio } = destr<{ audio: string }>(value);
            resolve(audio);
            unwatch();
        });
    });
}
