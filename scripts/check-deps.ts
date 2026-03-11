import { deepEqual } from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

interface PackageJson {
    name: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    homepage?: string;
    repository?: { type: string; url: string };
    bugs?: string | { url: string };
    author?: string;
    license?: string;
}

const rootDir = path.resolve(import.meta.dirname, "..");
const rootPkgPath = path.resolve(rootDir, "package.json");
const packagesDir = path.resolve(rootDir, "packages");
const packageMetadataFields = ["repository", "bugs", "homepage", "author", "license"] as const;

const rootPkg = await import(rootPkgPath, { with: { type: "json" } }) as PackageJson;
const rootDeps = {
    ...rootPkg.dependencies,
    ...rootPkg.devDependencies,
};

const packageDirs = await fs.readdir(packagesDir);

for (const dir of packageDirs) {
    const pkgPath = path.resolve(packagesDir, dir, "package.json");
    const pkg = await import(pkgPath, { with: { type: "json" } }) as PackageJson;

    const pkgDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
    };

    for (const depName of Object.keys(pkgDeps)) {
        if (!rootDeps[depName]) {
            console.error(`Package "${pkg.name}" depends on "${depName}" which is not listed in the root package.json`);
            process.exitCode = 1;
        }
        else {
            const rootVersion = rootDeps[depName];
            const pkgVersion = pkgDeps[depName];

            if (rootVersion !== pkgVersion) {
                console.error(
                    `❌ Version mismatch for dependency "${depName}" in package "${pkg.name}": `
                    + `root package.json has "${rootVersion}", but package has "${String(pkgVersion)}"`,
                );
                process.exitCode = 1;
            }
        }
    }

    for (const field of packageMetadataFields) {
        try {
            deepEqual(pkg[field], rootPkg[field]);
        }
        catch {
            console.error(
                `❌ Metadata field "${field}" in package "${pkg.name}" does not match the root package.json`,
            );
            process.exitCode = 1;
        }
    }
}

if (!process.exitCode) {
    console.log("✅ All package dependencies and metadata fields are consistent with the root package.json");
}
