<script lang="ts" setup>
import { Collapse } from "vue-collapsed";

withDefaults(defineProps<{
    heading?: string;
}>(), {
    heading: "Section Heading",
});

const isExpanded = defineModel<boolean>("expanded", { default: true });
</script>

<template>
    <div class=":uno: flex flex-col overflow-clip border bg-dark-700 shadow-sm divide-y dark:(border-dark-300 rounded-lg divide-dark-300)">
        <div class=":uno: min-h-8 flex shrink-0 rounded-t-lg bg-dark-300/30">
            <slot name="header">
                <div class=":uno: flex grow select-none items-center px-3 text-2.9 text-gray-500 font-semibold uppercase">
                    {{ heading }}
                </div>
            </slot>

            <div class=":uno: flex items-center justify-center px-1.5">
                <button class=":uno: size-6 flex shrink-0 items-center justify-center border border-transparent rounded-lg bg-transparent text-gray-500 outline-none transition active:(border-dark-300 bg-dark-500 shadow-md shadow-inset) hover:(border-dark-200 bg-dark-300)" @click="isExpanded = !isExpanded">
                    <Icon :data-expanded="isExpanded" class=":uno: size-4.5 transition data-[expanded=true]:(-rotate-180)" name="i-lucide:chevron-down" />
                </button>
            </div>
        </div>

        <Collapse :when="isExpanded">
            <div :class="{ ':uno: rounded-b-lg': !$slots.footer }" class=":uno: grow">
                <slot />
            </div>
        </Collapse>

        <div v-if="$slots.footer" class=":uno: min-h-6 shrink-0 rounded-b-lg bg-dark-300/5 px-3">
            <slot name="footer" />
        </div>
    </div>
</template>
