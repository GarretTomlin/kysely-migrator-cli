import * as path from 'path';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import pkg from 'pg';
import getConfig from '../config/migrator-config';

const migratorConfig = getConfig();

const destination = migratorConfig.migrationFolder;
const databaseUrl = migratorConfig.databaseUrl.replace('${DATABASE_URL}', process.env.DATABASE_URL);
const { Pool } = pkg;

export async function runAllMigrations() {
  
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

  const migrations = await migrator.getMigrations();
  const migrationFiles = migrations.map((migration) => migration.name);

  if (migrationFiles.length === 0) {
    console.log('No migration files found.');
  } else {
    console.log('Migration files:');
    migrationFiles.forEach((file) => {
      console.log(file);
    });
  }
}

runAllMigrations();
