<script lang="ts" setup>
import { vAutoAnimate } from "@formkit/auto-animate";

import type { WordData } from "~/types/application";

import { HOVER_ON_WORD, type HoverOnWordEventPayload } from "~/constants/events";

const { isDesktopOrTablet } = useDevice();

const eventHoverOnWord = useEventBus<HoverOnWordEventPayload>(HOVER_ON_WORD);

const applicationStore = useApplicationStore();
const { words } = storeToRefs(applicationStore);

function emitHoverOnWord(word: WordData, hover: boolean) {
    eventHoverOnWord.emit({ word, hover });
}
</script>

<template>
    <SectionPanel :expanded="isDesktopOrTablet" heading="Individual Word">
        <div v-auto-animate class=":uno: flex flex-col divide-y dark:(divide-dark-300)">
            <div
                v-for="word in words"
                :key="word.id"
                class=":uno: h-10 flex items-center px-3 transition hover:(bg-dark-500/50)"
                @mouseenter="() => emitHoverOnWord(word, true)"
                @mouseleave="() => emitHoverOnWord(word, false)"
            >
                <IndividualWordFeature :word="word" />
            </div>
        </div>
    </SectionPanel>
</template>
