#!/usr/bin/env ts-node
import {
  migrate_create_default
} from "../chunk-BDDQTGU3.mjs";
import {
  migrate_default
} from "../chunk-MEXD2Y6I.mjs";
import {
  rollback_default
} from "../chunk-4NEVKQJH.mjs";
import {
  run_all_migrations_default
} from "../chunk-HAAXJKN4.mjs";
import "../chunk-LWZJ3WJ6.mjs";

// src/bin/migrator.ts
import { build } from "gluegun";
var program = build().brand("Kysely Migrator").src(`${__dirname}/../commands`).command(migrate_create_default).command(migrate_default).command(rollback_default).command(run_all_migrations_default).checkForUpdates(2).help().create();
program.run();
