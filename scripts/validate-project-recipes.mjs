import fs from "node:fs";
import path from "node:path";

const calculatorsPath = path.join(
  process.cwd(),
  "data",
  "calculators.ts"
);

const recipesPath = path.join(
  process.cwd(),
  "data",
  "projectRecipes.ts"
);

const calculatorSource = fs.readFileSync(calculatorsPath, "utf8");
const recipeSource = fs.readFileSync(recipesPath, "utf8");

const calculatorIds = new Set(
  [...calculatorSource.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map(
    (match) => match[1]
  )
);

const recipeBlocks = [
  ...recipeSource.matchAll(
    /id:\s*"([^"]+)"[\s\S]*?scope:\s*\[([\s\S]*?)\]\s*,?\s*\}\s*,?\s*\];/g
  ),
];

const issues = [];

for (const recipeMatch of recipeBlocks) {
  const recipeId = recipeMatch[1];
  const scopeBlock = recipeMatch[2];

  const componentBlocks = [
    ...scopeBlock.matchAll(
      /\{\s*id:\s*"([^"]+)"[\s\S]*?calculatorId:\s*"([^"]+)"[\s\S]*?\}/g
    ),
  ];

  const seenComponentIds = new Set();

  for (const componentMatch of componentBlocks) {
    const componentId = componentMatch[1];
    const calculatorId = componentMatch[2];

    if (seenComponentIds.has(componentId)) {
      issues.push(
        `${recipeId} has duplicate scope component id: ${componentId}`
      );
    }

    seenComponentIds.add(componentId);

    if (!calculatorIds.has(calculatorId)) {
      issues.push(
        `${recipeId}/${componentId} references missing calculator id: ${calculatorId}`
      );
    }
  }
}

console.log(`Project recipes: ${recipeBlocks.length}`);

if (issues.length) {
  console.error("\nProject recipe validation failed:\n");

  for (const issue of issues) {
    console.error(`- ${issue}`);
  }

  process.exit(1);
}

console.log("Project recipe validation passed.");
