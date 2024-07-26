<script lang="ts" setup>
import CounterButton from "~/features/welcome/components/CounterButton.vue";
import { provideCounterStore } from "~/features/welcome/stores/counter";
</script>

<template>
    <div class=":uno: flex flex-col pb-0.5">
        <div>
            <div class=":uno: text-sm font-semibold">
                Injection State Store
            </div>
            <div class=":uno: text-sm text-gray-500">
                Counter example using injection state store at component level with initial state.
            </div>
        </div>

        <div class=":uno: mt-2 border border-dark-300 rounded-lg bg-dark-800 p-3 light:(border-gray-300 bg-light-600)">
            <div class=":uno: grid grid-cols-2 gap-x-2">
                <InjectionStoreProvider :provider="() => provideCounterStore({ count: 20 })">
                    <CounterButton />
                </InjectionStoreProvider>

                <InjectionStoreProvider :provider="() => provideCounterStore({ count: 50 })">
                    <CounterButton />
                </InjectionStoreProvider>
            </div>

            <div class=":uno: mt-3 text-center text-xs text-gray-500">
                This counter is using injection state store at component level. Each component has its own state.
            </div>
        </div>
    </div>
</template>
