import {
  migrator_config_default
} from "./chunk-EMEHRNG5.js";

// src/commands/migrate-create.ts
import fs from "fs/promises";
import * as path from "path";
import pkg from "pg";
import { Kysely, PostgresDialect } from "kysely";
var __dirname = path.resolve();
var config = migrator_config_default();
var destination = config.migrationFolder;
var databaseUrl = config.databaseUrl.replace("${DATABASE_URL}", process.env.DATABASE_URL);
var { Pool } = pkg;
var kyselyDatabase = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: databaseUrl
    })
  })
});
async function generateMigration(migrationName) {
  const migrationFolder = path.join(__dirname, destination);
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[^0-9]/g, "");
  const fileName = `${timestamp}-${migrationName}.ts`;
  const databaseForCheck = kyselyDatabase;
  const exists = await tableExists(databaseForCheck, migrationName);
  if (exists) {
    console.log(`Table '${migrationName}' already exists in the database. Skipping migration.`);
    return;
  }
  const migrationContent = `
    // Example: creating a table
    import { Kysely } from 'kysely';
    
    export async function up(database: Kysely<null>): Promise<void> {
      await database.schema
        .createTable('${migrationName}')
        .addColumn('id', 'serial', (column) => column.primaryKey())
        .addColumn('name', 'text', (column) => column.notNull())
        // add more columns as needed
        .execute();
    }
    
    export async function down(database: Kysely<null>): Promise<void> {
      database.schema.dropTable('${migrationName}');
    }
  `;
  try {
    await fs.mkdir(migrationFolder, { recursive: true });
    await fs.writeFile(
      path.join(migrationFolder, fileName),
      migrationContent
    );
    console.log(`Migration file generated: ${fileName}`);
    console.log(`Migration file generated at: ${path.join(migrationFolder, fileName)}`);
  } catch (error) {
    console.error("Failed to generate migration:", error);
  }
}
async function tableExists(database, tableName) {
  try {
    const result = await database.oneOrNone(
      `SELECT to_regclass($1) AS table_name;`,
      [tableName]
    );
    return !!result?.table_name;
  } catch (error) {
    console.error("Error checking table existence:", error);
    return false;
  }
}

export {
  generateMigration
};
