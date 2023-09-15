import {
  __async,
  migrator_config_default
} from "./chunk-LWZJ3WJ6.mjs";

// src/commands/run-all-migrations.ts
import path from "path";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider
} from "kysely";
import pkg from "pg";
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
      const { Pool } = pkg;
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
          migrationFolder: path.join(process.cwd(), destination)
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

export {
  run_all_migrations_default
};
