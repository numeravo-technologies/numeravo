import fs from "node:fs";
import path from "node:path";

const registryPath = path.join(process.cwd(), "data", "calculators.ts");
const source = fs.readFileSync(registryPath, "utf8");

const ids = [...source.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map(
  (match) => match[1]
);

const hrefs = [...source.matchAll(/^\s*href:\s*"([^"]+)"/gm)].map(
  (match) => match[1]
);

const relatedBlocks = [
  ...source.matchAll(
    /id:\s*"([^"]+)"[\s\S]*?related:\s*\[([\s\S]*?)\][\s\S]*?(?=\n\s*\},|\n\];)/g
  ),
];

const issues = [];

const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const duplicateHrefs = hrefs.filter(
  (href, index) => hrefs.indexOf(href) !== index
);

for (const id of [...new Set(duplicateIds)]) {
  issues.push(`Duplicate id: ${id}`);
}

for (const href of [...new Set(duplicateHrefs)]) {
  issues.push(`Duplicate href: ${href}`);
}

const idSet = new Set(ids);

for (const block of relatedBlocks) {
  const calculatorId = block[1];
  const relatedIds = [...block[2].matchAll(/"([^"]+)"/g)].map(
    (match) => match[1]
  );

  for (const relatedId of relatedIds) {
    if (relatedId === calculatorId) {
      issues.push(`${calculatorId} links to itself`);
    }

    if (!idSet.has(relatedId)) {
      issues.push(
        `${calculatorId} references missing related id: ${relatedId}`
      );
    }
  }
}

for (const href of hrefs) {
  const routePath = path.join(
    process.cwd(),
    "app",
    href.replace(/^\//, ""),
    "page.tsx"
  );

  if (!fs.existsSync(routePath)) {
    issues.push(`Missing route for href: ${href}`);
  }
}

console.log(`Calculator records: ${ids.length}`);
console.log(`Unique hrefs: ${new Set(hrefs).size}`);

if (issues.length) {
  console.error("\nRegistry validation failed:\n");

  for (const issue of issues) {
    console.error(`- ${issue}`);
  }

  process.exit(1);
}

console.log("Registry validation passed.");
