import {
  __async,
  migrator_config_default
} from "./chunk-X6DUVTPS.js";

// src/commands/migrate-create.ts
import fs from "fs/promises";
import * as path from "path";
import yargs from "yargs";
var config = migrator_config_default();
var destination = config.migrationFolder;
function generateMigration() {
  return __async(this, null, function* () {
    const argv = yield yargs(process.argv.slice(2)).option("name", {
      alias: "n",
      description: "Specify the migration name",
      type: "string",
      demandOption: true
    }).help().alias("help", "h").argv;
    const migrationFolder = path.join(__dirname, destination);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[^0-9]/g, "");
    const migrationName = `${timestamp}-${argv.name}.ts`;
    const migrationContent = `
    
  // Example: creating a table
  import { Kysely } from 'kysely';
  
  export async function up(database: Kysely<unknown>): Promise<void> {
    await database.schema
      .createTable('your_table_name')
      .addColumn('id', 'serial', (column) => column.primaryKey())
      .addColumn('name', 'text', (column) => column.notNull())
      // add more column has needed
      .execute();
  }
  
  export async function down(database: Kysely<unknown>): Promise<void> {
   database.schema.dropTable('your_table_name');
  }
  
  `;
    try {
      yield fs.mkdir(migrationFolder, { recursive: true });
      yield fs.writeFile(
        path.join(migrationFolder, migrationName),
        migrationContent
      );
      console.log(`Migration file generated: ${migrationName}`);
    } catch (error) {
      console.error("Failed to generate migration:", error);
    }
  });
}
generateMigration();

export {
  generateMigration
};
