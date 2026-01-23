import eslintJS from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { type Linter } from "eslint";

const styleLint = stylistic.configs.customize({
    indent: 4,
    jsx: false,
    quotes: "double",
    semi: true,
});

export const common: Linter.Config[] = [
    eslintJS.configs.recommended,
    styleLint,
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
];
