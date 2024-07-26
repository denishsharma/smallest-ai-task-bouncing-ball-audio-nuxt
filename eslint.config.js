import antfu from "@antfu/eslint-config";

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
    antfu({
        formatters: true,
        vue: true,
        unocss: {
            strict: true,
            overrides: {
                "unocss/enforce-class-compile": "warn",
            },
        },
        stylistic: {
            indent: 4,
            semi: true,
            quotes: "double",
            overrides: {
                "style/array-bracket-newline": ["error", { multiline: true, minItems: 3 }],
                "style/function-call-argument-newline": ["error", "consistent"],
                "style/brace-style": [
                    "error",
                    "1tbs",
                    { allowSingleLine: true },
                ],
                "style/max-statements-per-line": ["error", { max: 2 }],
            },
        },
        rules: {
            "antfu/if-newline": "off",

            "import/order": [
                "error",
                {
                    "newlines-between": "always",
                    "groups": [
                        ["external"],
                        [
                            "parent",
                            "internal",
                            "builtin",
                            "sibling",
                            "index",
                        ],
                        "object",
                        "type",
                    ],
                    "alphabetize": { order: "asc", caseInsensitive: true },
                },
            ],
            "import/newline-after-import": ["error", { count: 1 }],

            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",

            "vue/max-attributes-per-line": [
                "error",
                {
                    singleline: 3,
                    multiline: {
                        max: 1,
                    },
                },
            ],
        },
    }),
);
