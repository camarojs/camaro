import type { TSESLint } from "@typescript-eslint/utils";
import eslintTS from "typescript-eslint";
import { common } from "./common.js";
import { defineConfig } from "eslint/config";

export interface TypescriptLintConfigOptions {
    files: string[];
}

export const createTypescriptLintConfig = (options: TypescriptLintConfigOptions): TSESLint.FlatConfig.ConfigArray => {
    return defineConfig(
        common,
        {
            files: options.files,
            extends: [
                eslintTS.configs.recommendedTypeChecked,
                eslintTS.configs.strictTypeChecked,
                eslintTS.configs.stylisticTypeChecked,
            ],
            languageOptions: {
                parser: eslintTS.parser,
                parserOptions: { projectService: true },
            },
            rules: {
                "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
            },
        },
    );
};
