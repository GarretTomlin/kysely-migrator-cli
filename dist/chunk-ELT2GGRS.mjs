import {
  migrator_config_default
} from "./chunk-I4RCPBB3.mjs";
import {
  __async
} from "./chunk-DO6NXZSM.mjs";

// src/commands/migrate-create.ts
import fs from "fs/promises";
import * as path from "path";
var config = migrator_config_default();
var destination = config.migrationFolder;
function generateMigration(migrationName) {
  return __async(this, null, function* () {
    const migrationFolder = path.join(__dirname, destination);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[^0-9]/g, "");
    const fileName = `${timestamp}-${migrationName}.ts`;
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
      yield fs.mkdir(migrationFolder, { recursive: true });
      yield fs.writeFile(
        path.join(migrationFolder, fileName),
        migrationContent
      );
      console.log(`Migration file generated: ${fileName}`);
      console.log(`Migration file generated at: ${path.join(migrationFolder, fileName)}`);
    } catch (error) {
      console.error("Failed to generate migration:", error);
    }
  });
}

export {
  generateMigration
};
