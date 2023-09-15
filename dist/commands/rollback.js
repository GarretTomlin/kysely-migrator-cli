"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/commands/rollback.ts
var rollback_exports = {};
__export(rollback_exports, {
  default: () => rollback_default
});
module.exports = __toCommonJS(rollback_exports);
var import_path2 = __toESM(require("path"));
var import_pg = require("pg");
var import_fs2 = require("fs");
var import_kysely = require("kysely");
var import_dotenv = require("dotenv");

// src/config/migrator-config.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function getConfig() {
  try {
    const configPath = import_path.default.resolve(process.cwd(), "migrator.json");
    const rawConfig = import_fs.default.readFileSync(configPath, "utf8");
    return JSON.parse(rawConfig);
  } catch (error) {
    console.error("Error loading configuration:", error);
    process.exit(1);
  }
}
var migrator_config_default = getConfig;

// src/commands/rollback.ts
var migrateDown = {
  name: "migrate:down",
  alias: ["down"],
  description: "Roll back the latest migration",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print } = toolbox;
    try {
      const migratorConfig = migrator_config_default();
      (0, import_dotenv.config)();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
      const database = new import_kysely.Kysely({
        dialect: new import_kysely.PostgresDialect({
          pool: new import_pg.Pool({
            connectionString: databaseUrl
          })
        })
      });
      const migrator = new import_kysely.Migrator({
        db: database,
        provider: new import_kysely.FileMigrationProvider({
          fs: import_fs2.promises,
          path: import_path2.default,
          migrationFolder: import_path2.default.join(process.cwd(), destination)
        })
      });
      const { results } = yield migrator.migrateDown();
      results == null ? void 0 : results.forEach((migrationResult) => {
        if (migrationResult.status === "Success") {
          print.success(
            `Migration "${migrationResult.migrationName}" was rolled back successfully`
          );
        } else if (migrationResult.status === "Error") {
          print.error(
            `Failed to roll back migration "${migrationResult.migrationName}"`
          );
        } else {
          print.info("No migration to roll back");
        }
      });
      yield database.destroy();
    } catch (error) {
      print.error("Failed to roll back migrations:");
    }
  })
};
var rollback_default = migrateDown;
