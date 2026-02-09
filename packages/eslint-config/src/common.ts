import eslintJS from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

const styleLintConfig = stylistic.configs.customize({
    indent: 4,
    quotes: "double",
    semi: true,
});

export const common = defineConfig(
    eslintJS.configs.recommended,
    styleLintConfig,
    {
        rules: {
            "eqeqeq": "error",
            "prefer-const": ["error", { destructuring: "all" }],

            "@stylistic/array-bracket-newline": "error",
            "@stylistic/array-element-newline": ["error", "consistent"],
            "@stylistic/function-call-spacing": ["error", "never"],
            "@stylistic/function-paren-newline": ["error", "multiline-arguments"],
            "@stylistic/max-len": ["error", { code: 120 }],
            "@stylistic/object-curly-newline": "error",
        },
    },
);
