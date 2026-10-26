import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
const target = fileURLToPath(new URL("../.env", import.meta.url));
if (!existsSync(target)) {
  const sample = readFileSync(
    new URL("../.env.example", import.meta.url),
    "utf8",
  );
  writeFileSync(
    target,
    sample.replaceAll("CHANGE_ME", () => randomBytes(24).toString("hex")),
    { mode: 0o600 },
  );
  console.log("Created local .env. Passwords are stored there, not in Git.");
} else console.log("Existing .env preserved.");
