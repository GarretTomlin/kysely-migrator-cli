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
  const executedMigrations = /* @__PURE__ */ new Set();
  for (const migrationResult of results || []) {
    if (migrationResult.status === "Success") {
      const migrationName = migrationResult.migrationName;
      executedMigrations.add(migrationName);
      console.log(`migration "${migrationName}" was executed successfully`);
    } else if (migrationResult.status === "Error") {
      console.error(`failed to execute migration "${migrationResult.migrationName}"`);
    }
  }
  for (const migrationName of executedMigrations) {
    try {
      await database.insertInto("migrations").values({ migration_name: migrationName }).execute();
      console.log(`Inserted migration "${migrationName}" into the migrations table.`);
    } catch (error2) {
      console.error(`Failed to insert migration "${migrationName}" into the migrations table: ${error2}`);
    }
  }
  if (error) {
    console.error("Failed to migrate");
    console.error(error);
    process.exit(1);
  }
  await database.destroy();
}
migrateToLatest();

export {
  migrateToLatest
};
