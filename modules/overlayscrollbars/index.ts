import { addImportsDir, addPlugin, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "overlayscrollbars",
    },
    setup: () => {
        const { resolve } = createResolver(import.meta.url);

        addPlugin(resolve("./plugin.ts"));
        addImportsDir(resolve("./constants"));
    },
});
