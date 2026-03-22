import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const publishRoot = path.join(repoRoot, ".publish");
const publishDir = path.join(publishRoot, "package");

const sourcePackageJsonPath = path.join(repoRoot, "package.json");
const sourcePackageJson = JSON.parse(fs.readFileSync(sourcePackageJsonPath, "utf8"));

const publishPackageJson = {
  name: sourcePackageJson.name,
  version: sourcePackageJson.version,
  description: sourcePackageJson.description,
  type: sourcePackageJson.type,
  main: sourcePackageJson.main,
  exports: sourcePackageJson.exports,
  keywords: sourcePackageJson.keywords,
  license: sourcePackageJson.license,
  repository: sourcePackageJson.repository,
  bugs: sourcePackageJson.bugs,
  homepage: sourcePackageJson.homepage,
  publishConfig: sourcePackageJson.publishConfig,
  openclaw: sourcePackageJson.openclaw,
};

const requiredEntries = [
  "LICENSE",
  "README.md",
  "openclaw.plugin.json",
  "dist/index.js",
  "skills",
];

fs.rmSync(publishRoot, { recursive: true, force: true });
fs.mkdirSync(publishDir, { recursive: true });

for (const relativePath of requiredEntries) {
  const sourcePath = path.join(repoRoot, relativePath);
  const targetPath = path.join(publishDir, relativePath);
  copyRuntimeEntry(sourcePath, targetPath);
}

fs.writeFileSync(
  path.join(publishDir, "package.json"),
  `${JSON.stringify(publishPackageJson, null, 2)}\n`,
);

const stagedFiles = listFiles(publishDir);
console.log(`Prepared publish directory: ${publishDir}`);
console.log(`Package: ${publishPackageJson.name}@${publishPackageJson.version}`);
console.log("Included files:");
for (const filePath of stagedFiles) {
  console.log(`- ${filePath}`);
}

function copyRuntimeEntry(sourcePath, targetPath) {
  const stat = safeStat(sourcePath);
  if (!stat) {
    throw new Error(`Missing required publish input: ${path.relative(repoRoot, sourcePath)}`);
  }

  if (stat.isDirectory()) {
    fs.mkdirSync(targetPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
      if (entry.name === ".DS_Store") {
        continue;
      }
      copyRuntimeEntry(path.join(sourcePath, entry.name), path.join(targetPath, entry.name));
    }
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function listFiles(rootDir) {
  const results = [];
  walk(rootDir);
  return results.sort();

  function walk(currentPath) {
    for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      results.push(path.relative(rootDir, fullPath));
    }
  }
}

function safeStat(filePath) {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}
