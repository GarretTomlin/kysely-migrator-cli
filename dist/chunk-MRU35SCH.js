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
    const migrationResult = await migrator.migrateUp();
    migrationResult.results?.forEach((migration) => {
      if (migration.status === "Success") {
        console.log(
          `Migration "${migration.migrationName}" was executed successfully`
        );
      } else {
        console.error(
          `Failed to execute migration "${migration.migrationName}": ${migration.status}`
        );
      }
    });
    if (migrationResult.error) {
      console.error("Failed to migrate");
      console.error(migrationResult.error);
      process.exit(1);
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
migrateToLatest();

export {
  migrateToLatest
};
