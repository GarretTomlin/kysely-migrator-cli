import {
  __async,
  migrator_config_default
} from "./chunk-LWZJ3WJ6.mjs";

// src/commands/rollback.ts
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
var migrateDown = {
  name: "migrate:down",
  alias: ["down"],
  description: "Roll back the latest migration",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print } = toolbox;
    try {
      const migratorConfig = migrator_config_default();
      config();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
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

export {
  rollback_default
};
