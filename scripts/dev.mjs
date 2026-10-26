import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const local = {};
if (existsSync(root + ".env")) {
  for (const line of readFileSync(root + ".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) local[match[1]] = match[2].trim();
  }
}
const children = [];
let closing = false;
function stop(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of children) child.kill("SIGTERM");
  process.exitCode = code;
}
function run(command, args) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  children.push(child);
  child.on("error", (error) => {
    console.error(
      `Could not start ${command}: ${error.message}. See README.md for setup.`,
    );
    stop(1);
  });
  child.on("exit", (code) => {
    if (!closing) stop(code || 0);
  });
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
// Containers supply API_TARGET because Apache runs as a separate service.
if (!process.env.API_TARGET) {
  run(process.env.PHP_BIN || local.PHP_BIN || "php", [
    "-S",
    "127.0.0.1:8080",
    "-t",
    "public",
    "backend/router.php",
  ]);
}
run(process.execPath, [
  "node_modules/vite/bin/vite.js",
  ...process.argv.slice(2),
]);
