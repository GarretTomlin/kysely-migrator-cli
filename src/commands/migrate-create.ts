import { GluegunCommand } from 'gluegun';
import fs from 'fs/promises';
import path from 'path';
import getConfig from '../config/migrator-config';

const generateMigration: GluegunCommand = {
  name: 'migrate:create',
  alias: ['create'],
  description: 'Generate a migration file (--name)',
  run: async (toolbox) => {
    const { print, parameters } = toolbox;
    const migrationName = parameters.first;

    if (!migrationName) {
      print.error('Please specify a migration name.');
      return;
    }

    const config = getConfig();
    const destination = config.migrationFolder;
    const migrationFolder = path.join(process.cwd(), destination);
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
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
      await fs.mkdir(migrationFolder, { recursive: true });
      await fs.writeFile(
        path.join(migrationFolder, fileName),
        migrationContent,
      );
      print.info(`Migration file generated: ${fileName}`);
      print.info(`Migration file generated at: ${path.join(migrationFolder, fileName)}`);
    } catch (error) {
      print.error('Failed to generate migration:');
    }
  },
};

export default generateMigration;
