import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "injection-state",
    },
    setup: async () => {
        const { resolve } = createResolver(import.meta.url);

        addImportsDir(resolve("./composables"));

        await addComponentsDir({
            path: resolve("./components"),
            extensions: ["vue"],
        });
    },
});
