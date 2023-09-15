import {
  migrator_config_default
} from "./chunk-EMEHRNG5.js";

// src/commands/migrate-create.ts
import fs from "fs/promises";
import * as path from "path";
import yargs from "yargs";
var __dirname = path.resolve();
var config = migrator_config_default();
var destination = config.migrationFolder;
async function generateMigration(name) {
  const migrationFolder = path.join(__dirname, destination);
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[^0-9]/g, "");
  const migrationName = `${timestamp}-${name}.ts`;
  const migrationContent = `
    
  // Example: creating a table
  import { Kysely } from 'kysely';
  
  export async function up(database: Kysely<unknown>): Promise<void> {
    await database.schema
      .createTable('your_table_name')
      .addColumn('id', 'serial', (column) => column.primaryKey())
      .addColumn('name', 'text', (column) => column.notNull())
      // add more columns as needed
      .execute();
  }
  
  export async function down(database: Kysely<unknown>): Promise<void> {
    database.schema.dropTable('your_table_name');
  }
  
  `;
  try {
    await fs.mkdir(migrationFolder, { recursive: true });
    await fs.writeFile(
      path.join(migrationFolder, migrationName),
      migrationContent
    );
    console.log(`Migration file generated: ${migrationName}`);
    console.log(`Migration file generated at: ${path.join(migrationFolder, migrationName)}`);
  } catch (error) {
    console.error("Failed to generate migration:", error);
  }
}

export {
  generateMigration
};
