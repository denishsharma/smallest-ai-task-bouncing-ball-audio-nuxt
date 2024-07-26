export function useInjectionStateStore<T>(name: string, injectionStore: () => T | undefined, defaultValue?: T) {
    return () => {
        const store = injectionStore();
        if (defaultValue !== undefined && store === undefined) {
            return defaultValue;
        }

        if (store === undefined) {
            throw new Error(`Please provide a store for ${name}`);
        }

        return store;
    };
}
