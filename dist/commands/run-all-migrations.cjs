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
  return new Promise((resolve2, reject) => {
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
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/commands/run-all-migrations.ts
var run_all_migrations_exports = {};
__export(run_all_migrations_exports, {
  runAllMigrations: () => runAllMigrations
});
module.exports = __toCommonJS(run_all_migrations_exports);
var path2 = __toESM(require("path"), 1);
var import_fs2 = require("fs");
var import_kysely = require("kysely");
var import_pg = __toESM(require("pg"), 1);

// src/config/migrator-config.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var __dirname = import_path.default.resolve();
function getConfig() {
  try {
    const configPath = import_path.default.resolve(__dirname, "migrator.json");
    const rawConfig = import_fs.default.readFileSync(configPath, "utf8");
    return JSON.parse(rawConfig);
  } catch (error) {
    console.error("Error loading configuration:", error);
    process.exit(1);
  }
}
var migrator_config_default = getConfig;

// src/commands/run-all-migrations.ts
var __dirname2 = path2.resolve();
var migratorConfig = migrator_config_default();
var destination = migratorConfig.migrationFolder;
var databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
var { Pool } = import_pg.default;
function runAllMigrations() {
  return __async(this, null, function* () {
    const database = new import_kysely.Kysely({
      dialect: new import_kysely.PostgresDialect({
        pool: new Pool({
          connectionString: databaseUrl
        })
      })
    });
    const migrator = new import_kysely.Migrator({
      db: database,
      provider: new import_kysely.FileMigrationProvider({
        fs: import_fs2.promises,
        path: path2,
        migrationFolder: path2.join(__dirname2, destination)
      })
    });
    const { error, results } = yield migrator.migrateToLatest();
    results == null ? void 0 : results.forEach((it) => {
      if (it.status === "Success") {
        console.log(`migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });
    if (error) {
      console.error("failed to run `migrateToLatest`");
      console.error(error);
    }
  });
}
runAllMigrations();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runAllMigrations
});
