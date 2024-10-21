// Polyfill Symbol.metadata
(Symbol as { metadata?: symbol }).metadata ??= Symbol("Symbol.metadata");

import { run } from "node:test";
import { spec } from "node:test/reporters";

const stream = run({
    concurrency: true,
    // @ts-expect-error remove when types are updated
    execArgv: ["--enable-source-maps"],
    globPatterns: ["test/**/*.test.ts"],

    coverage: true,
    coverageExcludeGlobs: ["test/**/*.test.ts"],

    branchCoverage: 90,
    functionsCoverage: 90,
    lineCoverage: 90,

    setup(reporter) {
        reporter.on("test:fail", () => {
            process.exitCode = 1;
        });
    },
});

stream.compose(spec).pipe(process.stdout);
