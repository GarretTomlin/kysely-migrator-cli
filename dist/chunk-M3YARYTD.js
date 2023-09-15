import {
  __async,
  migrator_config_default
} from "./chunk-X6DUVTPS.js";

// src/commands/rollback.ts
import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider
} from "kysely";
import { config } from "dotenv";
var migratorConfig = migrator_config_default();
config();
var destination = migratorConfig.migrationFolder;
var databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
function migrateDown() {
  return __async(this, null, function* () {
    const database = new Kysely({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: databaseUrl
        })
      })
    });
    const migrator = new Migrator({
      db: database,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, destination)
      })
    });
    const { error, results } = yield migrator.migrateDown();
    results == null ? void 0 : results.forEach((migrationResult) => {
      if (migrationResult.status === "Success") {
        console.log(
          `Migration "${migrationResult.migrationName}" was rolled back successfully`
        );
      } else if (migrationResult.status === "Error") {
        console.error(
          `Failed to roll back migration "${migrationResult.migrationName}"`
        );
      }
    });
    if (error) {
      console.error("Failed to migrate down");
      console.error(error);
      process.exit(1);
    }
    yield database.destroy();
  });
}
migrateDown();

export {
  migrateDown
};
