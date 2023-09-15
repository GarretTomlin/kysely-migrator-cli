// src/config/migrator-config.ts
import fs from "fs";
import path from "path";
var __dirname = path.resolve();
function getConfig() {
  try {
    const configPath = path.resolve(__dirname, "config.json");
    const rawConfig = fs.readFileSync(configPath, "utf8");
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
