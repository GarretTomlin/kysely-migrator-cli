// src/config/migrator-config.ts
import fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
async function getConfig() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const configPath = path.resolve(path.dirname(__filename), "../migrator.json");
    const rawConfig = await fs.readFile(configPath, "utf8");
    return JSON.parse(rawConfig);
  } catch (error) {
    console.error("Error loading configuration:", error);
    process.exit(1);
  }
}
var migrator_config_default = getConfig;

export {
  migrator_config_default
};
