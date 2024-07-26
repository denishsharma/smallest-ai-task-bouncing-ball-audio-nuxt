import { addComponentsDir, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "load-components",
    },
    setup: async () => {
        const { resolve } = createResolver(import.meta.url);

        await addComponentsDir({
            path: resolve("../fragments/"),
            extensions: ["vue"],
            pattern: "**/*.fragment.vue",
        });

        await addComponentsDir({
            path: resolve("../features/"),
            extensions: ["vue"],
            pattern: "**/*.feature.vue",
        });
    },
});
