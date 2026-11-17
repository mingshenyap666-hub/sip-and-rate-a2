import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
// Copy an explicit allowlist. Never copy local credentials or the repository root.
await readFile(root + "dist/index.html");
await rm(root + "hosting", { recursive: true, force: true });
await mkdir(root + "hosting", { recursive: true });
await cp(root + "dist", root + "hosting/public_html", { recursive: true });
await cp(root + "backend", root + "hosting/backend", { recursive: true });
await cp(root + "database_export/sip_rate.sql", root + "hosting/sip_rate.sql");
await cp(root + "docs/DEPLOYMENT.md", root + "hosting/DEPLOYMENT.md");
const example = await readFile(root + ".env.example", "utf8");
await writeFile(root + "hosting/.env.example", example.replace("SECURE_COOKIES=0", "SECURE_COOKIES=1"));
console.log("Hosting files are ready in hosting/. Follow docs/DEPLOYMENT.md before uploading.");
