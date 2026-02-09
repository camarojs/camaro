import eslintTS from "typescript-eslint";
import { common } from "./common.js";
import { defineConfig, type Config } from "eslint/config";

export const createTypescriptLintConfig = (options: Config = {}) => {
    const { languageOptions, rules, ...restOptions } = options;

    return defineConfig(
        common,
        {
            extends: [
                eslintTS.configs.recommendedTypeChecked,
                eslintTS.configs.strictTypeChecked,
                eslintTS.configs.stylisticTypeChecked,
            ],
            languageOptions: {
                parser: eslintTS.parser,
                parserOptions: { projectService: true },
                ...languageOptions,
            },
            rules: {
                "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
                ...rules,
            },
            ...restOptions,
        },
    );
};
