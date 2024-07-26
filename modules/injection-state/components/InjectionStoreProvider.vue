<script lang="ts" setup>
const props = defineProps<{
    provider: () => any;
}>();

props.provider();
</script>

<template>
    <slot />
</template>
