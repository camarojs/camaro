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

// Collect all packages (root + workspace packages)
const allPackages: { name: string; deps: Record<string, string> }[] = [];

allPackages.push({
    name: rootPkg.name,
    deps: {
        ...rootPkg.dependencies,
        ...rootPkg.devDependencies,
    },
});

const packageDirs = await fs.readdir(packagesDir);

for (const dir of packageDirs) {
    const pkgPath = path.resolve(packagesDir, dir, "package.json");
    const pkg = await import(pkgPath, { with: { type: "json" } }) as PackageJson;

    allPackages.push({
        name: pkg.name,
        deps: {
            ...pkg.dependencies,
            ...pkg.devDependencies,
        },
    });
}

// Build a map: depName -> Map<version, packageNames[]>
const depVersionMap = new Map<string, Map<string, string[]>>();

for (const pkg of allPackages) {
    for (const [depName, version] of Object.entries(pkg.deps)) {
        let versionMap = depVersionMap.get(depName);
        if (!versionMap) {
            versionMap = new Map();
            depVersionMap.set(depName, versionMap);
        }

        const pkgList = versionMap.get(version);
        if (pkgList) {
            pkgList.push(pkg.name);
        }
        else {
            versionMap.set(version, [pkg.name]);
        }
    }
}

// Report mismatches
for (const [depName, versionMap] of depVersionMap) {
    if (versionMap.size > 1) {
        const details = [...versionMap.entries()]
            .map(([version, pkgs]) => `  "${version}" in: ${pkgs.join(", ")}`)
            .join("\n");

        console.error(`❌ Version mismatch for "${depName}":\n${details}`);
        process.exitCode = 1;
    }
}

// Check metadata fields for workspace packages
for (const dir of packageDirs) {
    const pkgPath = path.resolve(packagesDir, dir, "package.json");
    const pkg = await import(pkgPath, { with: { type: "json" } }) as PackageJson;

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
    console.log("✅ All package dependencies and metadata fields are consistent");
}
