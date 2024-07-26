<script lang="ts" setup>
import { random } from "radash";
import { z } from "zod";

const randomPostId = ref<string>("1");

const postSchema = z.object({
    id: z.number(),
    title: z.string(),
    body: z.string(),
});

const { data, status } = await useJsonPlaceholderData<z.infer<typeof postSchema>>("posts/{id}", {
    path: () => ({ id: randomPostId.value }),
    transform: (data) => {
        return postSchema.parse(data);
    },
    lazy: true,
});

function randomizePost() {
    randomPostId.value = random(1, 20).toString();
}
</script>

<template>
    <div class=":uno: flex flex-col pb-0.5">
        <div>
            <div class=":uno: text-sm font-semibold">
                Proxied Third Party API
            </div>
            <div class=":uno: text-sm text-gray-500">
                Random post from jsonplaceholder.typicode.com that is proxied through the Nuxt server.
            </div>
        </div>

        <div class=":uno: mt-2 border border-dark-300 rounded-lg bg-dark-800 p-3 light:(border-gray-300 bg-light-600)">
            <div class=":uno: text-sm text-gray-500">
                <div :class="[{ ':uno: animate-pulse': status === 'pending' }]" class=":uno: mb-3">
                    <template v-if="data">
                        <div class=":uno: line-clamp-1 mb-1 pr-10 text-sm font-medium">
                            {{ data.title }}
                        </div>
                        <div class=":uno: line-clamp-3 pr-1 text-xs op-50 light:(op-80)">
                            {{ data.body }}
                        </div>
                    </template>
                </div>
            </div>
            <button
                :data-loading="status === 'pending'"
                :disabled="status === 'pending'"
                class=":uno: group h-8 w-full flex items-center justify-center border border-dark-200 rounded-lg bg-dark-300/50 px-2 text-center text-sm transition transition data-[loading=true]:(animate-pulse) light:(border-gray-300 bg-light-50 active:border-gray-300 active:bg-light-50 hover:bg-light-500) active:(bg-dark-400) hover:(bg-dark-300)"
                type="button"
                @click="randomizePost"
            >
                <Icon class=":uno: mr-2 size-4 scale-90 op-0 transition group-data-[loading=true]:(scale-100 op-100)" name="i-svg-spinners:270-ring" />
                <span class=":uno: transition -translate-x-4 group-data-[loading=true]:(translate-x-0)">Randomize</span>
            </button>
        </div>
    </div>
</template>
