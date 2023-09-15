import {
  migrator_config_default
} from "./chunk-EMEHRNG5.js";

// src/commands/migrate.ts
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
async function migrateToLatest() {
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
  try {
    const { error, results } = await migrator.migrateUp();
    results?.forEach((migrationResult) => {
      if (migrationResult.status === "Success") {
        console.log(
          `Migration "${migrationResult.migrationName}" was executed successfully`
        );
      } else if (migrationResult.status === "Error") {
        console.error(
          `Failed to execute migration "${migrationResult.migrationName}": ${migrationResult.status}`
        );
      }
    });
    if (error) {
      console.error("Failed to migrate:", error);
    } else {
      console.log("Migration completed successfully.");
    }
  } catch (error) {
    console.error("An error occurred during migration:", error);
  } finally {
    await database.destroy();
  }
}
migrateToLatest();

export {
  migrateToLatest
};
