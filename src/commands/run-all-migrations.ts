import { GluegunCommand } from 'gluegun';
import path from 'path';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import pkg from 'pg';
import getConfig from '../config/migrator-config';

const runAllMigrations: GluegunCommand = {
  name: 'migrate:latest',
  alias: ['latest'],
  description: 'Run all pending migrations',
  run: async (toolbox) => {
    const { print } = toolbox;

    try {
      const migratorConfig = getConfig();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace('${DATABASE_URL}', process.env.DATABASE_URL);
      const { Pool } = pkg;

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

      const { error, results } = await migrator.migrateToLatest();

      results?.forEach((migrationResult) => {
        if (migrationResult.status === 'Success') {
          print.success(
            `Migration "${migrationResult.migrationName}" was executed successfully`,
          );
        } else if (migrationResult.status === 'Error') {
          print.error(
            `Failed to execute migration "${migrationResult.migrationName}"`,
          );
        }
      });

      if (error) {
        print.error('Failed to run `migrateToLatest`');
        print.error(error);
      }
    } catch (error) {
      print.error('Failed to run all migrations:');
    }
  },
};

export default runAllMigrations;
