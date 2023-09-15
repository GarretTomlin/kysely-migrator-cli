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
var executedMigrations = /* @__PURE__ */ new Map();
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
  const { error, results } = await migrator.migrateToLatest();
  for (const migrationResult of results) {
    try {
      if (migrationResult.status === "Success") {
        const migrationName = migrationResult.migrationName;
        if (!executedMigrations.has(migrationName)) {
          console.log(
            `Migration "${migrationName}" was executed successfully`
          );
          await markMigrationAsExecuted(migrationName);
          executedMigrations.set(migrationName, true);
        } else {
          console.log(
            `Migration "${migrationName}" was already executed, skipping.`
          );
        }
      } else if (migrationResult.status === "Error") {
        console.error(
          `Failed to execute migration "${migrationResult.migrationName}"`
        );
      }
    } catch (err) {
      console.error("Error handling migration result:", err);
    }
  }
  if (error) {
    console.error("Failed to migrate");
    console.error(error);
    process.exit(1);
  }
  await database.destroy();
}
async function markMigrationAsExecuted(migrationName) {
  const client = new pkg.Client({
    connectionString: databaseUrl
  });
  try {
    await client.connect();
    const insertQuery = "INSERT INTO your_table_name (migration_name, execution_date) VALUES ($1, NOW())";
    const values = [migrationName];
    await client.query(insertQuery, values);
  } catch (error) {
    console.error("Error marking migration as executed:", error);
  } finally {
    client.end();
  }
}
migrateToLatest();

export {
  migrateToLatest
};
