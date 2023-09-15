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

const migrateDown: GluegunCommand = {
  name: 'migrate:down',
  alias: ['down'],
  description: 'Roll back the latest migration',
  run: async (toolbox) => {
    const { print } = toolbox;

    try {
      const migratorConfig = getConfig();
      config();
      const destination = migratorConfig.migrationFolder;
      const databaseUrl = migratorConfig.databaseUrl.replace('${DATABASE_URL}', process.env.DATABASE_URL);

      const database = new Kysely<unknown>({
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

      const { results } = await migrator.migrateDown();

      results?.forEach((migrationResult) => {
        if (migrationResult.status === 'Success') {
          print.success(
            `Migration "${migrationResult.migrationName}" was rolled back successfully`,
          );
        } else if (migrationResult.status === 'Error') {
          print.error(
            `Failed to roll back migration "${migrationResult.migrationName}"`,
          );
        } else if (migrationResult.status === 'NotExecuted') {
          print.info('No migration to roll back');
        }
      });

      await database.destroy();
    } catch (error) {
      print.error('Failed to roll back migrations:');
    }
  },
};

export default migrateDown;
