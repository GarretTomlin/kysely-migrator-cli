import {
  __async,
  migrator_config_default
} from "./chunk-MM6C4AGZ.mjs";

// src/commands/migrate-create.ts
import fs from "fs/promises";
import path from "path";
var generateMigration = {
  name: "migrate:create",
  alias: ["create"],
  description: "Generate a migration file (--name)",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print, parameters } = toolbox;
    const migrationName = parameters.first;
    if (!migrationName) {
      print.error("Please specify a migration name.");
      return;
    }
    const config = migrator_config_default();
    const destination = config.migrationFolder;
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
      print.info(`Migration file generated: ${fileName}`);
      print.info(`Migration file generated at: ${path.join(migrationFolder, fileName)}`);
    } catch (error) {
      print.error("Failed to generate migration:");
    }
  })
};
var migrate_create_default = generateMigration;

export {
  migrate_create_default
};
