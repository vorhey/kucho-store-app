#!/usr/bin/env bun
import { watch } from "fs";
import { spawn } from "child_process";
import path from "path";

console.log("👀 Watching for changes in src directory...");

// Initial build
let buildProcess = spawn("bun", ["run", "build.ts"], { stdio: "inherit" });

// Setup file watcher
const watcher = watch(path.join(process.cwd(), "src"), { recursive: true });

watcher.on("change", (_, filename) => {
  console.log(`\n🔄 File changed: ${filename}`);

  // Kill previous build process if it's still running
  if (buildProcess && !buildProcess.killed) {
    buildProcess.kill();
  }

  console.log("🏗️ Rebuilding...");
  buildProcess = spawn("bun", ["run", "build.ts"], { stdio: "inherit" });
});

// Handle script termination
process.on("SIGINT", () => {
  watcher.close();
  if (buildProcess && !buildProcess.killed) {
    buildProcess.kill();
  }
  console.log("\n👋 Watch stopped");
  process.exit(0);
});
