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
  try {
    const migrationFolderPath = path.join(__dirname, destination);
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
        migrationFolder: migrationFolderPath
      })
    });
    const migrationFiles = await fs.readdir(migrationFolderPath);
    for (const migrationFile of migrationFiles) {
      const filePath = path.join(migrationFolderPath, migrationFile);
      const { results } = await migrator.migrateUp();
      results?.forEach((migrationResult) => {
        if (migrationResult.status === "Success") {
          console.log(
            `Migration "${migrationResult.migrationName}" was executed successfully`
          );
        } else if (migrationResult.status === "Error") {
          console.error(
            `Failed to execute migration "${migrationResult.migrationName}"`
          );
        }
      });
    }
    await database.destroy();
  } catch (error) {
    console.error("Error processing migration files:", error);
  }
}
migrateToLatest();

export {
  migrateToLatest
};
