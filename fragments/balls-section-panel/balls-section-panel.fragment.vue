<script lang="ts" setup>
const ballsStore = useBallsStore();
const { balls } = storeToRefs(ballsStore);
</script>

<template>
    <SectionPanel heading="Balls">
        <div class=":uno: flex flex-col divide-y dark:(divide-dark-300)">
            <div v-if="balls.length === 0" class=":uno: relative min-h-50 flex flex-col select-none items-center justify-center px-3">
                <div class=":uno: size-10 flex items-center justify-center rounded-full bg-dark-300">
                    <Icon class=":uno: size-4.5 text-gray-500" name="i-lucide:database" />
                </div>
                <div class=":uno: mb-10 mt-3 text-sm text-gray-500">
                    We couldn't find any data for balls.
                </div>

                <div class=":uno: absolute bottom-6 text-xs text-gray-600">
                    Press <kbd class=":uno: border border-dark-100 rounded-md bg-dark-300 px-1 pt-0.5 text-gray-500 font-medium leading-none uppercase">Space</kbd> to add a random ball to the scene.
                </div>
            </div>

            <template v-else>
                <div v-for="ball in balls" :key="ball.id" class=":uno: flex select-none items-center px-3 py-4 transition-background-color hover:(bg-dark-500/50)">
                    <IndividualBallRecordFeature :record="ball" />
                </div>
            </template>
        </div>
    </SectionPanel>
</template>
