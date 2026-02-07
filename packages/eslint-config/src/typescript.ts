import type { TSESLint } from "@typescript-eslint/utils";
import eslintTS from "typescript-eslint";
import { common } from "./common.js";

const eslintTsRules = [
    ...eslintTS.configs.recommendedTypeChecked,
    ...eslintTS.configs.strictTypeChecked,
    ...eslintTS.configs.stylisticTypeChecked,
].reduce<TSESLint.FlatConfig.Rules>((acc, config) => ({ ...acc, ...config.rules }), {});

export const createTypescriptLintConfig = (files: string[]): TSESLint.FlatConfig.ConfigArray => {
    return [
        ...common,
        {
            files,
            languageOptions: {
                parser: eslintTS.parser,
                parserOptions: { projectService: true },
            },
            plugins: { "@typescript-eslint": eslintTS.plugin },
            rules: {
                ...eslintTsRules,
                "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
            },
        },
    ];
};
