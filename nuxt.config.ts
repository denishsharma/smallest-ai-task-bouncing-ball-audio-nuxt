import { isDevelopment } from "std-env";

export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: "2024-07-27",
    app: {
        rootId: "__app",
        head: {
            link: [
                {
                    rel: "icon",
                    type: "image/svg",
                    href: "/favicon.svg",
                },
            ],
        },
    },
    site: {
        name: "Bouncing Ball Audio | Task by smallest.ai",
        description: "Create a 2D arena with gravity where a ball spawns randomly, bounces on audio-triggering floor panes, and sends concatenated audio to the backend, which is then playable/downloadable on the frontend. Made by Denish Sharma",
    },
    typescript: {
        typeCheck: "build",
        tsConfig: {
            compilerOptions: {
                noErrorTruncation: true,
            },
        },
    },
    css: ["~/assets/styles/global.scss"],
    modules: [
        "@nuxt/eslint",
        "@unocss/nuxt",
        "@nuxt/fonts",
        "@nuxtjs/seo",
        "@nuxtjs/color-mode",
        "@nuxt/icon",
        "nuxt-svgo",
        "@vueuse/nuxt",
        "@nuxt/scripts",
        "nuxt-typed-router",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "nuxt-api-party",
        "@nuxtjs/device",
    ],
    $production: {
        scripts: {
            registry: {
                googleAnalytics: {
                    id: "G-K4NGLMN4ZH",
                },
                clarity: {
                    id: "nfvqailixp",
                },
            },
        },
    },
    device: {
        refreshOnResize: true,
    },
    apiParty: {
        server: {
            basePath: "_proxy_",
        },
        endpoints: {
            jsonPlaceholder: {
                url: "https://jsonplaceholder.typicode.com",
            },
        },
    },
    seo: {
        debug: isDevelopment,
    },
    colorMode: {
        classSuffix: "",
        globalName: "__APP_COLOR_MODE__",
        storageKey: "app-color-mode",
        hid: "app-color-mode-script",
        disableTransition: true,
    },
    svgo: {
        autoImportPath: "~/assets",
    },
    piniaPersistedstate: {
        debug: isDevelopment,
        cookieOptions: {
            secure: !isDevelopment,
        },
    },
    eslint: {
        config: {
            standalone: false,
        },
    },
});
