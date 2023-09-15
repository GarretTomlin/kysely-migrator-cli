import {
  __async,
  migrator_config_default
} from "./chunk-MM6C4AGZ.mjs";

// src/commands/migrate.ts
import path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider
} from "kysely";
import { config } from "dotenv";
var migrate = {
  name: "migrate",
  description: "Migrate to the latest version",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print } = toolbox;
    try {
      const migratorConfig = migrator_config_default();
      config();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace(
        "${DATABASE_URL}",
        process.env.DATABASE_URL
      );
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
  return "An error occurred during migration.";
}
var migrate_default = migrate;

export {
  migrate_default
};
