import globals from "globals";

import { defineTypescriptConfig } from "../packages/eslint-config/src/typescript.ts";

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
        ignores: ["eng/**/*"],
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
