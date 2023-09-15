import {
  migrator_config_default
} from "./chunk-NXA2FUZU.js";

// src/commands/run-all-migrations.ts
import * as path from "path";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider
} from "kysely";
import pkg from "pg";
var migratorConfig = migrator_config_default();
var destination = migratorConfig.migrationFolder;
var databaseUrl = migratorConfig.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
var { Pool } = pkg;
async function runAllMigrations() {
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
  const migrations = await migrator.getMigrations();
  const migrationFiles = migrations.map((migration) => migration.name);
  if (migrationFiles.length === 0) {
    console.log("No migration files found.");
  } else {
    console.log("Migration files:");
    migrationFiles.forEach((file) => {
      console.log(file);
    });
  }
}
runAllMigrations();

export {
  runAllMigrations
};
