#!/usr/bin/env bun
import { build, type BuildConfig } from "bun";
import plugin from "bun-plugin-tailwind";
import { existsSync } from "fs";
import { rm, cp } from "fs/promises";
import { watch } from "fs";
import path from "path";

// Print help text if requested
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🏗️  Bun Watch Script

Usage: bun run build-watch.ts [options]

Common Options:
  --outdir <path>          Output directory (default: "dist")
  --minify                 Enable minification (or --minify.whitespace, --minify.syntax, etc)
  --source-map <type>      Sourcemap type: none|linked|inline|external
  --target <target>        Build target: browser|bun|node
  --format <format>        Output format: esm|cjs|iife
  --splitting              Enable code splitting
  --packages <type>        Package handling: bundle|external
  --public-path <path>     Public path for assets
  --env <mode>             Environment handling: inline|disable|prefix*
  --conditions <list>      Package.json export conditions (comma separated)
  --external <list>        External packages (comma separated)
  --banner <text>          Add banner text to output
  --footer <text>          Add footer text to output
  --define <obj>           Define global constants (e.g. --define.VERSION=1.0.0)
  --help, -h               Show this help message

Example:
  bun run build-watch.ts --outdir=dist --source-map=linked --external=react,react-dom
`);
  process.exit(0);
}

// Helper function to convert kebab-case to camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// Helper function to parse a value into appropriate type
const parseValue = (value: string): any => {
  // Handle true/false strings
  if (value === "true") return true;
  if (value === "false") return false;

  // Handle numbers
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

  // Handle arrays (comma-separated)
  if (value.includes(",")) return value.split(",").map((v) => v.trim());

  // Default to string
  return value;
};

// Magical argument parser that converts CLI args to BuildConfig
function parseArgs(): Partial<BuildConfig> {
  const config: Record<string, any> = {};
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith("--")) continue;

    // Handle --no-* flags
    if (arg.startsWith("--no-")) {
      const key = toCamelCase(arg.slice(5));
      config[key] = false;
      continue;
    }

    // Handle --flag (boolean true)
    if (
      !arg.includes("=") &&
      (i === args.length - 1 || args[i + 1].startsWith("--"))
    ) {
      const key = toCamelCase(arg.slice(2));
      config[key] = true;
      continue;
    }

    // Handle --key=value or --key value
    let key: string;
    let value: string;

    if (arg.includes("=")) {
      [key, value] = arg.slice(2).split("=", 2);
    } else {
      key = arg.slice(2);
      value = args[++i];
    }

    // Convert kebab-case key to camelCase
    key = toCamelCase(key);

    // Handle nested properties (e.g. --minify.whitespace)
    if (key.includes(".")) {
      const [parentKey, childKey] = key.split(".");
      config[parentKey] = config[parentKey] || {};
      config[parentKey][childKey] = parseValue(value);
    } else {
      config[key] = parseValue(value);
    }
  }

  return config as Partial<BuildConfig>;
}

// Helper function to format file sizes
const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// Function to perform the build
async function performBuild(cliConfig: Partial<BuildConfig>, isInitial = true) {
  const outdir = cliConfig.outdir || path.join(process.cwd(), "dist");

  if (isInitial && existsSync(outdir)) {
    console.log(`🗑️ Cleaning previous build at ${outdir}`);
    await rm(outdir, { recursive: true, force: true });
  }

  const start = performance.now();

  // Scan for all HTML files in the project
  const entrypoints = [...new Bun.Glob("**.html").scanSync("src")]
    .map((a) => path.resolve("src", a))
    .filter((dir) => !dir.includes("node_modules"));

  if (isInitial) {
    console.log(
      `📄 Found ${entrypoints.length} HTML ${entrypoints.length === 1 ? "file" : "files"} to process\n`,
    );
  }

  // Build all the HTML files
  const result = await build({
    entrypoints,
    outdir,
    plugins: [plugin],
    minify: true,
    target: "browser",
    sourcemap: "linked",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    ...cliConfig, // Merge in any CLI-provided options
  });

  // Copy image assets if this is the initial build
  if (isInitial) {
    const imagesDir = path.join(process.cwd(), "src/assets/images");
    const imagesOutDir = path.join(outdir, "assets/images");

    if (existsSync(imagesDir)) {
      console.log("📸 Copying image assets...");
      await cp(imagesDir, imagesOutDir, { recursive: true });
      console.log(
        `✅ Images copied to ${path.relative(process.cwd(), imagesOutDir)}`,
      );
    }
  }

  // Print the results
  const end = performance.now();

  if (!isInitial) {
    // For rebuilds, show a simpler output
    console.log(`\n✅ Rebuild completed in ${(end - start).toFixed(2)}ms\n`);
  } else {
    // For initial build, show the full table
    const outputTable = result.outputs.map((output) => ({
      File: path.relative(process.cwd(), output.path),
      Type: output.kind,
      Size: formatFileSize(output.size),
    }));

    console.table(outputTable);
    console.log(
      `\n✅ Initial build completed in ${(end - start).toFixed(2)}ms\n`,
    );
  }

  return result;
}

async function main() {
  console.log("\n🚀 Starting watch mode...\n");

  // Parse CLI arguments with our magical parser
  const cliConfig = parseArgs();

  // Perform initial build
  await performBuild(cliConfig, true);

  console.log("\n👀 Watching for changes in src directory...");

  // Set up file watcher
  const watcher = watch("src", { recursive: true }, async (_, filename) => {
    if (!filename) return;

    // Skip node_modules if they somehow end up in src
    if (filename.includes("node_modules")) return;

    console.log(`\n🔄 File changed: ${filename}`);
    console.log("🏗️ Rebuilding...");

    try {
      await performBuild(cliConfig, false);
    } catch (error) {
      console.error("❌ Rebuild failed:", error);
    }
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n👋 Watch mode terminated");
    watcher.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
