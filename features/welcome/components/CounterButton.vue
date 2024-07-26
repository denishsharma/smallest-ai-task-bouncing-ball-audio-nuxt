<script lang="ts" setup>
import { useCounterStore } from "~/features/welcome/stores/counter";

const { count, increment } = useCounterStore();
</script>

<template>
    <button class=":uno: h-8 w-full select-none border border-dark-200 rounded-lg bg-dark-300/50 px-2 text-sm transition light:(border-gray-300 bg-light-50 active:border-gray-300 active:bg-light-50 hover:bg-light-500) active:(bg-dark-400) hover:(bg-dark-300)" @click="increment">
        {{ count }}
    </button>
</template>
