import path from "node:path";
import fs from "node:fs/promises";

interface PackageJson {
    name: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

const rootDir = path.resolve(import.meta.dirname, "..");
const rootPkgPath = path.resolve(rootDir, "package.json");
const packagesDir = path.resolve(rootDir, "packages");

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
                    `Version mismatch for dependency "${depName}" in package "${pkg.name}": `
                    + `root package.json has "${rootVersion}", but package has "${pkgVersion}"`,
                );
                process.exitCode = 1;
            }
        }
    }
}

if (process.exitCode === 0) {
    console.log("All dependencies are correctly listed in the root package.json");
}
