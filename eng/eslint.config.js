import { defineTypescriptConfig } from "@camaro/eslint-config/typescript";

export default defineTypescriptConfig(
    {
        files: ["**/*.ts"],
        globals: ["node"],
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
