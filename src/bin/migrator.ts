#!/usr/bin/env node

import { program } from "commander";
import { generateMigration } from "../commands/migrate-create";
import { migrateDown } from "../commands/rollback";
import { runAllMigrations } from "../commands/run-all-migrations";
import { migrateToLatest } from "../commands/migrate";

program
  .version('1.0.0')
  .description('Kysely Migrator')
  .command('migrate:create', 'Generate a migration file')
  .command('migrate', 'Migrate to the latest version')
  .command('rollback', 'Roll back the last migration')
  .command('run:migrations', 'Runs all migrations that have not yet been run')
  .parse(process.argv);

// const command = program.args[0];

// if (command === 'migrate:create') {
//   generateMigration();
// } else if (command === 'migrate') {
//   migrateToLatest();
// } else if (command === 'rollback') {
//   migrateDown();
// } else if (command === 'run:migrations') {
//   runAllMigrations();
// } else {
//   console.error('Unknown command:', command);
//   process.exit(1);
// }
