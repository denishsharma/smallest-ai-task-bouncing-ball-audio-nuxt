<script lang="ts" setup>
withDefaults(defineProps<{
    heading?: string;
}>(), {
    heading: "Section Heading",
});
</script>

<template>
    <div class=":uno: flex flex-col overflow-clip border bg-dark-700 shadow-sm divide-y dark:(border-dark-300 rounded-lg divide-dark-300)">
        <div class=":uno: min-h-8 flex shrink-0 rounded-t-lg bg-dark-300/30">
            <slot name="header">
                <div class=":uno: flex grow select-none items-center px-3 text-2.9 text-gray-500 font-semibold uppercase">
                    {{ heading }}
                </div>
            </slot>
        </div>

        <div :class="{ ':uno: rounded-b-lg': !$slots.footer }" class=":uno: grow">
            <slot />
        </div>

        <div v-if="$slots.footer" class=":uno: min-h-6 shrink-0 rounded-b-lg bg-dark-300/5 px-3">
            <slot name="footer" />
        </div>
    </div>
</template>
