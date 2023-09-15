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
  const { error, results } = await migrator.migrateToLatest();
  results?.forEach((migrationResult) => {
    if (migrationResult.status === "Success") {
      console.log(
        `migration "${migrationResult.migrationName}" was executed successfully`
      );
      markMigrationAsExecuted(migrationResult.migrationName);
    } else if (migrationResult.status === "Error") {
      console.error(
        `failed to execute migration "${migrationResult.migrationName}"`
      );
    }
  });
  if (error) {
    console.error("Failed to migrate");
    console.error(error);
    process.exit(1);
  }
  async function markMigrationAsExecuted(migrationName) {
    const client = new pkg.Client({
      connectionString: databaseUrl
    });
    try {
      await client.connect();
      const insertQuery = "INSERT INTO your_table_name (migration_name, execution_date) VALUES ($1, $2)";
      const currentDate = /* @__PURE__ */ new Date();
      const values = [migrationName, currentDate];
      await client.query(insertQuery, values);
    } catch (error2) {
      console.error("Error marking migration as executed:", error2);
    } finally {
      client.end();
    }
  }
  await database.destroy();
}
migrateToLatest();

export {
  migrateToLatest
};
