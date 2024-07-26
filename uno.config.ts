import { isProduction } from "std-env";
import { defineConfig, presetIcons, presetUno, transformerCompileClass, transformerDirectives, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import { presetUseful } from "unocss-preset-useful";

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons(),
        presetAnimations(),
        presetUseful(),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
        ...(isProduction ? [transformerCompileClass({ classPrefix: "x-" })] : []),
    ],
});
