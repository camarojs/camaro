import { defineTypescriptConfig } from "@camaro/eslint-config/typescript";
import globals from "globals";

export default defineTypescriptConfig(
    {},
    {
        files: ["**/*.ts"],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        ignores: ["packages/**/lib/**/*"],
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
);
