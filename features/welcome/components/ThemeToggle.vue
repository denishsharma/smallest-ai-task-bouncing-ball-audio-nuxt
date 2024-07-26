<script lang="ts" setup>
const colorMode = useColorMode();

function toggleColorMode() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
    <button
        class=":uno: size-8 flex cursor-pointer items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm outline-none transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200) light:active:(border-gray-300 bg-light-50) light:hover:(bg-light-50)"
        @click="toggleColorMode"
    >
        <Icon
            :name="colorMode.value === 'dark' ? 'i-mynaui:moon' : 'i-mynaui:sun'"
            class=":uno: size-5"
        />
    </button>
</template>
