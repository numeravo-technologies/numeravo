import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (
      error?.code !== "ERR_MODULE_NOT_FOUND" ||
      !specifier.startsWith(".")
    ) {
      throw error;
    }

    const parentURL = context.parentURL;

    if (!parentURL) {
      throw error;
    }

    const candidateURL = new URL(`${specifier}.ts`, parentURL);
    const candidatePath = fileURLToPath(candidateURL);

    if (!existsSync(candidatePath)) {
      throw error;
    }

    return {
      url: pathToFileURL(candidatePath).href,
      shortCircuit: true,
    };
  }
}
