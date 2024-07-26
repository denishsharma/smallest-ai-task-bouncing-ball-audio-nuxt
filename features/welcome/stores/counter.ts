import { ref } from "vue";

const [provideCounterStore, counterStore] = createInjectionState((initial?: { count: number }) => {
    const _count = ref<number>(initial?.count ?? 0);

    function increment() {
        _count.value++;
    }

    return { count: readonly(_count), increment };
});

const useCounterStore = useInjectionStateStore("counter", counterStore);

export { provideCounterStore, useCounterStore };
