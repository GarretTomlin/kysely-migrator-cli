import {
  migrator_config_default
} from "./chunk-EMEHRNG5.js";

// src/commands/rollback.ts
import * as path from "path";
import pkg from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider
} from "kysely";
import { config } from "dotenv";
var __dirname = path.resolve();
var migratorConfig = migrator_config_default();
config();
var destination = migratorConfig.migrationFolder;
var databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
var { Pool } = pkg;
async function migrateDown() {
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
  const { results } = await migrator.migrateDown();
  results?.forEach((migrationResult) => {
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
  await database.destroy();
}
migrateDown();

export {
  migrateDown
};
