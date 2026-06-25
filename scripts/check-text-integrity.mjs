import fs from "node:fs";
import path from "node:path";

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "node_modules",
  "supabase",
]);

const ignoredFiles = new Set([
  "package-lock.json",
]);

const textExtensions = new Set([
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
]);

const mojibakePatterns = [
  { label: "UTF-8 read as Latin-1 / Windows-1252", pattern: /(?:\u00c3|\u00c2|\u00e2\u20ac|\u00e2\u201a|\u00e2\u2020|\ufffd)/u },
  {
    label: "Portuguese text with replacement question marks",
    pattern:
      /\b(?:conte\?do|configura\?\?o|sess\?es?|inscri\?\?o|energ\?tica|formul\?rio|dist\?ncia|orienta\?\?o|avalia\?\?o|restaura\?\?o|harmoniza\?\?o|liberta\?\?es|padr\?es)\b/iu,
  },
];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...walk(fullPath));
      }
      continue;
    }

    if (ignoredFiles.has(entry.name)) continue;
    if (textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

const findings = [];

for (const file of walk(process.cwd())) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const { label, pattern } of mojibakePatterns) {
      if (pattern.test(line)) {
        findings.push({
          file: path.relative(process.cwd(), file).replaceAll("\\", "/"),
          label,
          line: index + 1,
          text: line.trim().slice(0, 180),
        });
      }
    }
  });
}

if (findings.length) {
  console.error("Text integrity check failed. Possible corrupted text found:\n");
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} [${finding.label}] ${finding.text}`);
  }
  process.exit(1);
}

console.log("Text integrity check passed.");
