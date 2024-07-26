<script lang="ts" setup>
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

import ThemeToggle from "~/features/welcome/components/ThemeToggle.vue";
import CounterSection from "~/features/welcome/fragments/CounterSection.vue";
import PostSection from "~/features/welcome/fragments/PostSection.vue";

const [DefineSocialButtonLink, SocialButtonLink] = createReusableTemplate<{ to: string }>();

const currentYear = useDateFormat(useNow(), "YYYY");
</script>

<template>
    <DefineSocialButtonLink v-slot="{ $slots, to }">
        <NuxtLink
            :external="true"
            :to="to"
            class=":uno: bg-dark-400) border-gray-300)) active:(bg-light-50 active:(border-dark-300 hover:bg-dark-200light:hover:bg-light-500 light:(hover:bg-light-500 size-7 flex cursor-pointer items-center justify-center gap-x-2 border border-transparent rounded-lg bg-transparent text-sm transition active:(border-dark-300 bg-dark-400) hover:(bg-dark-200) light:(active:border-gray-300 active:bg-light-50)"
            target="_blank"
        >
            <component :is="$slots.default" />
        </NuxtLink>
    </DefineSocialButtonLink>

    <div class=":uno: relative select-none bg-dark-800 text-light-50 h-dvh light:(bg-light-300 text-gray-900)" v-bind="$attrs">
        <div class=":uno: absolute inset-0">
            <div class=":uno: size-full bg-[#99d3ff] bg-[radial-gradient(at_69%_33%,hsla(293,61%,79%,1)_0px,transparent_50%),radial-gradient(at_3%_1%,hsla(347,74%,68%,1)_0px,transparent_50%),radial-gradient(at_4%_88%,hsla(284,79%,64%,1)_0px,transparent_50%),radial-gradient(at_36%_19%,hsla(66,98%,72%,1)_0px,transparent_50%),radial-gradient(at_56%_25%,hsla(114,69%,78%,1)_0px,transparent_50%),radial-gradient(at_48%_22%,hsla(109,83%,63%,1)_0px,transparent_50%),radial-gradient(at_32%_61%,hsla(257,68%,62%,1)_0px,transparent_50%)]" />
            <div class=":uno: absolute inset-0 bg-black/90 backdrop-blur-2xl transition light:(bg-dark-500/30)" />
        </div>

        <div class=":uno: relative h-dvh">
            <OverlayScrollbarsComponent
                :defer="true"
                :options="defaultOverlayscrollbarsOptions"
                class=":uno: h-full p-10"
            >
                <div class=":uno: min-h-full flex items-center justify-center">
                    <div class=":uno: relative max-w-sm w-full flex flex-col overflow-clip border border-dark-300 rounded-xl bg-dark-500/60 shadow-lg backdrop-blur-3xl divide-y divide-dark-300 light:(border-gray-300 bg-white/90 shadow-xl divide-gray-400/50)">
                        <div class=":uno: gapx-4 flex items-center justify-between bg-dark-400/50 p-2.5 light:(bg-white/50)">
                            <div class=":uno: flex items-center">
                                <div class=":uno: size-8 flex select-none items-center justify-center rounded-lg bg-teal-800 text-sm text-light-50 font-bold leading-none">
                                    <Icon class=":uno: size-5" name="i-simple-icons:nuxtdotjs" />
                                </div>

                                <div class=":uno: ml-3 h-full flex flex-col select-none justify-center gap-y-1 leading-none">
                                    <div class=":uno: text-sm font-medium leading-none">
                                        Nuxt Starter Template
                                    </div>

                                    <NuxtLink
                                        :external="true"
                                        class=":uno: text-xs text-light-50/60 leading-none transition light:(text-gray-600) active:(op-100) hover:(op-80)"
                                        target="_blank"
                                        to="https://github.com/denishsharma"
                                    >
                                        By
                                        <span class=":uno: underline underline-gray-500 underline-offset-2 underline-dashed">
                                            Denish Sharma
                                        </span>
                                    </NuxtLink>
                                </div>
                            </div>

                            <div>
                                <ThemeToggle />
                            </div>
                        </div>

                        <div class=":uno: p-2.5">
                            <PostSection />
                        </div>

                        <div class=":uno: p-2.5">
                            <CounterSection />
                        </div>

                        <div class=":uno: flex items-center justify-between py-1 pl-1.5 pr-2.5 light:(bg-light-50/30)">
                            <div class=":uno: flex items-center">
                                <SocialButtonLink to="https://www.linkedin.com/in/denishsharma/">
                                    <div class=":uno: i-mynaui:brand-linkedin size-4" />
                                </SocialButtonLink>

                                <SocialButtonLink to="https://github.com/denishsharma/nuxt-starter-template/">
                                    <div class=":uno: i-mynaui:brand-github size-4" />
                                </SocialButtonLink>
                            </div>

                            <div class=":uno: flex items-center">
                                <span class=":uno: h-5 flex items-center rounded bg-dark-300 px-2 text-xs text-light-50/60 font-medium light:(bg-light-500 text-gray-500)">
                                    &copy;
                                    {{ currentYear }}
                                    Denish Sharma
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </OverlayScrollbarsComponent>
        </div>
    </div>
</template>
