import { GluegunCommand } from 'gluegun';
import path from 'path';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import { config } from 'dotenv';
import getConfig from '../config/migrator-config';

const migrate: GluegunCommand = {
  name: 'migrate',
  description: 'Migrate to the latest version',
  run: async (toolbox) => {
    const { print } = toolbox;

    try {
      const migratorConfig = getConfig();
      config();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace(
        '${DATABASE_URL}',
        process.env.DATABASE_URL
      );

      const database = new Kysely({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: databaseUrl,
          }),
        }),
      });

      const migrator = new Migrator({
        db: database,
        provider: new FileMigrationProvider({
          fs,
          path,
          migrationFolder: path.join(__dirname, destination),
        }),
      });

      const { error, results } = await migrator.migrateUp();

      results?.forEach((migrationResult) => {
        if (migrationResult.status === 'Success') {
          print.success(
            `Migration "${migrationResult.migrationName}" was executed successfully`
          );
        } else if (migrationResult.status === 'Error') {
          print.error(
            `Failed to execute migration "${migrationResult.migrationName}"`
          );
        }
      });

      if (error) {
        const errorMessage = extractErrorMessage(error);
        print.error(`Failed to migrate: ${errorMessage}`);
        process.exit(1);
      }
      

      await database.destroy();
    } catch (error) {
      print.error('An error occurred:');
      process.exit(1);
    }
  },
};

function extractErrorMessage(error: any): string {
  if (error && error.message) {
    const errorMessage = error.message;
    const match = errorMessage.match(/relation "(.+)" already exists/);
    if (match && match.length > 1) {
      return `Table "${match[1]}" already exists.`;
    }
  }
  return 'An error occurred during migration.';
}


export default migrate;
