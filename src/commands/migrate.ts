import * as path from 'path';
import pkg from 'pg';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import { config } from 'dotenv';
import getConfig from '../config/migrator-config';

const migratorConfig = getConfig();
config();
const destination = migratorConfig.migrationFolder;
const databaseUrl = migratorConfig.databaseUrl.replace('${DATABASE_URL}', process.env.DATABASE_URL);
const { Pool } = pkg;

export async function migrateToLatest() {
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

  const  { error, results } = await migrator.migrateToLatest();

  results?.forEach((migrationResult) => {
    if (migrationResult.status === 'Success') {
      console.log(
        `migration "${migrationResult.migrationName}" was executed successfully`,
      );
    } else if (migrationResult.status === 'Error') {
      console.error(
        `failed to execute migration "${migrationResult.migrationName}"`,
      );
    }
  });

  if (error) {
    console.error('Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await database.destroy();
}

migrateToLatest();
