"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/migrator.config.ts
var migrator_config_exports = {};
__export(migrator_config_exports, {
  default: () => migrator_config_default
});
module.exports = __toCommonJS(migrator_config_exports);
var fs = require("fs");
var path = require("path");
function getConfig() {
  try {
    const configPath = path.resolve(__dirname, "../migrator.json");
    const rawConfig = fs.readFileSync(configPath, "utf8");
    return JSON.parse(rawConfig);
  } catch (error) {
    console.error("Error loading configuration:", error);
    process.exit(1);
  }
}
var migrator_config_default = getConfig;
