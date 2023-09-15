#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve4, reject) => {
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
    var step = (x) => x.done ? resolve4(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/bin/migrator.ts
var import_commander = require("commander");

// src/commands/migrate-create.ts
var import_promises = __toESM(require("fs/promises"), 1);
var path2 = __toESM(require("path"), 1);

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

// src/commands/migrate-create.ts
var __dirname2 = path2.resolve();
var config = migrator_config_default();
var destination = config.migrationFolder;
function generateMigration(migrationName) {
  return __async(this, null, function* () {
    const migrationFolder = path2.join(__dirname2, destination);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[^0-9]/g, "");
    const fileName = `${timestamp}-${migrationName}.ts`;
    const migrationContent = `
  // Example: creating a table
  import { Kysely } from 'kysely';
  
  export async function up(database: Kysely<unknown>): Promise<void> {
    await database.schema
      .createTable('your_table_name')
      .addColumn('id', 'serial', (column) => column.primaryKey())
      .addColumn('name', 'text', (column) => column.notNull())
      // add more columns as needed
      .execute();
  }
  
  export async function down(database: Kysely<unknown>): Promise<void> {
    database.schema.dropTable('your_table_name');
  }
  `;
    try {
      yield import_promises.default.mkdir(migrationFolder, { recursive: true });
      yield import_promises.default.writeFile(
        path2.join(migrationFolder, fileName),
        migrationContent
      );
      console.log(`Migration file generated: ${fileName}`);
      console.log(`Migration file generated at: ${path2.join(migrationFolder, fileName)}`);
    } catch (error) {
      console.error("Failed to generate migration:", error);
    }
  });
}

// src/commands/rollback.ts
var path3 = __toESM(require("path"), 1);
var import_pg = __toESM(require("pg"), 1);
var import_fs2 = require("fs");
var import_kysely = require("kysely");
var import_dotenv = require("dotenv");
var __dirname3 = path3.resolve();
var migratorConfig = migrator_config_default();
(0, import_dotenv.config)();
var destination2 = migratorConfig.migrationFolder;
var databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
var { Pool } = import_pg.default;
function migrateDown() {
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
        path: path3,
        migrationFolder: path3.join(__dirname3, destination2)
      })
    });
    const { results } = yield migrator.migrateDown();
    results == null ? void 0 : results.forEach((migrationResult) => {
      if (migrationResult.status === "Success") {
        console.log(
          `Migration "${migrationResult.migrationName}" was rolled back successfully`
        );
      } else if (migrationResult.status === "Error") {
        console.error(
          `Failed to roll back migration "${migrationResult.migrationName}"`
        );
      } else if (migrationResult.status === "NotExecuted") {
        console.log("no migration to rollback");
      }
    });
    yield database.destroy();
  });
}
migrateDown();

// src/commands/migrate.ts
var path4 = __toESM(require("path"), 1);
var import_pg2 = __toESM(require("pg"), 1);
var import_fs3 = require("fs");
var import_kysely2 = require("kysely");
var import_dotenv2 = require("dotenv");
var __dirname4 = path4.resolve();
var migratorConfig2 = migrator_config_default();
(0, import_dotenv2.config)();
var destination3 = migratorConfig2.migrationFolder;
var databaseUrl2 = migratorConfig2.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
var { Pool: Pool2 } = import_pg2.default;
function migrateToLatest() {
  return __async(this, null, function* () {
    const database = new import_kysely2.Kysely({
      dialect: new import_kysely2.PostgresDialect({
        pool: new Pool2({
          connectionString: databaseUrl2
        })
      })
    });
    const migrator = new import_kysely2.Migrator({
      db: database,
      provider: new import_kysely2.FileMigrationProvider({
        fs: import_fs3.promises,
        path: path4,
        migrationFolder: path4.join(__dirname4, destination3)
      })
    });
    const { error, results } = yield migrator.migrateUp();
    results == null ? void 0 : results.forEach((migrationResult) => {
      if (migrationResult.status === "Success") {
        console.log(
          `migration "${migrationResult.migrationName}" was executed successfully`
        );
      } else if (migrationResult.status === "Error") {
        console.error(
          `failed to execute migration "${migrationResult.migrationName}"`
        );
      }
    });
    if (error) {
      console.error("Failed to migrate");
      console.error(error);
      process.exit(1);
    }
    yield database.destroy();
  });
}
migrateToLatest();

// src/bin/migrator.ts
var program = new import_commander.Command();
program.version("1.0.0").description("Kysely Migrator").command("migrate:create").description("Generate a migration file").option("-n, --name <name>", "Specify the migration name").action(function(options) {
  const migrationName = options.name;
  generateMigration(migrationName);
});
program.command("migrate:down").description("Roll back the last migration").action(function() {
  migrateDown();
});
program.command("migrate").description("Migrate to the latest version").action(function() {
  migrateToLatest();
});
program.parse();
