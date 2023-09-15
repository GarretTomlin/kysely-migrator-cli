#!/usr/bin/env ts-node
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

// src/bin/migrator.ts
var import_gluegun = require("gluegun");

// src/commands/migrate-create.ts
var import_promises = __toESM(require("fs/promises"));
var import_path2 = __toESM(require("path"));

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

// src/commands/migrate-create.ts
var generateMigration = {
  name: "migrate:create",
  alias: ["create"],
  description: "Generate a migration file (--name)",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print, parameters } = toolbox;
    const migrationName = parameters.first;
    if (!migrationName) {
      print.error("Please specify a migration name.");
      return;
    }
    const config3 = migrator_config_default();
    const destination = config3.migrationFolder;
    const migrationFolder = import_path2.default.join(process.cwd(), destination);
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
        import_path2.default.join(migrationFolder, fileName),
        migrationContent
      );
      print.info(`Migration file generated: ${fileName}`);
      print.info(`Migration file generated at: ${import_path2.default.join(migrationFolder, fileName)}`);
    } catch (error) {
      print.error("Failed to generate migration:");
    }
  })
};
var migrate_create_default = generateMigration;

// src/commands/migrate.ts
var import_path3 = __toESM(require("path"));
var import_pg = require("pg");
var import_fs2 = require("fs");
var import_kysely = require("kysely");
var import_dotenv = require("dotenv");
var migrate = {
  name: "migrate",
  description: "Migrate to the latest version",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print } = toolbox;
    try {
      const migratorConfig = migrator_config_default();
      (0, import_dotenv.config)();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace(
        "${DATABASE_URL}",
        process.env.DATABASE_URL
      );
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
          path: import_path3.default,
          migrationFolder: import_path3.default.join(process.cwd(), destination)
        })
      });
      const { error, results } = yield migrator.migrateUp();
      results == null ? void 0 : results.forEach((migrationResult) => {
        if (migrationResult.status === "Success") {
          print.success(
            `Migration "${migrationResult.migrationName}" was executed successfully`
          );
        } else if (migrationResult.status === "Error") {
          print.error(
            `Failed to execute migration "${migrationResult.migrationName}"`
          );
        } else {
          print.info("nothing to migrate");
        }
      });
      if (error) {
        const errorMessage = extractErrorMessage(error);
        print.error(`Failed to migrate: ${errorMessage}`);
        process.exit(1);
      }
      yield database.destroy();
    } catch (error) {
      print.error("An error occurred:");
      process.exit(1);
    }
  })
};
function extractErrorMessage(error) {
  if (error && error.message) {
    const errorMessage = error.message;
    const match = errorMessage.match(/relation "(.+)" already exists/);
    if (match && match.length > 1) {
      return `Table "${match[1]}" already exists.`;
    }
  }
  return "An error occurred during migration, please make sure DATABASE_URL is define in your env";
}
var migrate_default = migrate;

// src/commands/rollback.ts
var import_path4 = __toESM(require("path"));
var import_pg2 = require("pg");
var import_fs3 = require("fs");
var import_kysely2 = require("kysely");
var import_dotenv2 = require("dotenv");
var migrateDown = {
  name: "migrate:down",
  alias: ["down"],
  description: "Roll back the latest migration",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print } = toolbox;
    try {
      const migratorConfig = migrator_config_default();
      (0, import_dotenv2.config)();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
      const database = new import_kysely2.Kysely({
        dialect: new import_kysely2.PostgresDialect({
          pool: new import_pg2.Pool({
            connectionString: databaseUrl
          })
        })
      });
      const migrator = new import_kysely2.Migrator({
        db: database,
        provider: new import_kysely2.FileMigrationProvider({
          fs: import_fs3.promises,
          path: import_path4.default,
          migrationFolder: import_path4.default.join(process.cwd(), destination)
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

// src/commands/run-all-migrations.ts
var import_path5 = __toESM(require("path"));
var import_fs4 = require("fs");
var import_kysely3 = require("kysely");
var import_pg3 = __toESM(require("pg"));
var runAllMigrations = {
  name: "migrate:latest",
  alias: ["latest"],
  description: "Run all pending migrations",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print } = toolbox;
    try {
      const migratorConfig = migrator_config_default();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
      const { Pool: Pool3 } = import_pg3.default;
      const database = new import_kysely3.Kysely({
        dialect: new import_kysely3.PostgresDialect({
          pool: new Pool3({
            connectionString: databaseUrl
          })
        })
      });
      const migrator = new import_kysely3.Migrator({
        db: database,
        provider: new import_kysely3.FileMigrationProvider({
          fs: import_fs4.promises,
          path: import_path5.default,
          migrationFolder: import_path5.default.join(process.cwd(), destination)
        })
      });
      const { error, results } = yield migrator.migrateToLatest();
      results == null ? void 0 : results.forEach((migrationResult) => {
        if (migrationResult.status === "Success") {
          print.success(
            `Migration "${migrationResult.migrationName}" was executed successfully`
          );
        } else if (migrationResult.status === "Error") {
          print.error(
            `Failed to execute migration "${migrationResult.migrationName}"`
          );
        } else {
          print.info("nothing to migrate");
        }
      });
      if (error) {
        print.error("Failed to run `migrateToLatest`");
        print.error(error);
      }
    } catch (error) {
      print.error("Failed to run all migrations:");
    }
  })
};
var run_all_migrations_default = runAllMigrations;

// src/bin/migrator.ts
var program = (0, import_gluegun.build)().brand("Kysely Migrator").src(`${__dirname}/../commands`).command(migrate_create_default).command(migrate_default).command(rollback_default).command(run_all_migrations_default).checkForUpdates(2).help().create();
program.run();
