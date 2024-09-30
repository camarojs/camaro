// Polyfill Symbol.metadata
(Symbol as { metadata?: symbol }).metadata ??= Symbol("Symbol.metadata");

import { run } from "node:test";
import { spec } from "node:test/reporters";

const stream = run({
    concurrency: true,
    globPatterns: ["test/**/*.test.ts"],
});

stream.on("test:fail", () => {
    process.exitCode = 1;
});

stream.compose(spec).pipe(process.stdout);
