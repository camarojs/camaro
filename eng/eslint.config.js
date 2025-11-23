import { ts } from "@camaro/eslint-config/typescript";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
    ...ts,
    { ignores: ["packages/*/lib/**/*"] },
    {
        files: ["eng/**/*.js"],
        languageOptions: { globals: { ...globals.node } },
    },
    {
        ignores: ["eng/**/*.js"],
        rules: {
            "no-restricted-exports": [
                "error",
                {
                    restrictDefaultExports: { direct: true },
                },
            ],
        },
    },
];
