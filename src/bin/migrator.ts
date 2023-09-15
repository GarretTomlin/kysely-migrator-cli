#!/usr/bin/env ts-node
import { build } from 'gluegun';
import generateMigration from '../commands/migrate-create';
import migrate from '../commands/migrate';
import migrateDown from '../commands/rollback';
import runAllMigrations from '../commands/run-all-migrations';

const program = build()
  .brand('Kysely Migrator')
  .src(`${__dirname}/../commands`)
  .command(generateMigration)
  .command(migrate)
  .command(migrateDown)
  .command(runAllMigrations)
  .checkForUpdates(2)
  .help()
  .create();

program.run();
