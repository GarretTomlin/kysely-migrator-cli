# kysely-migrator-cli

A light weight hassle free migration cli for [Kysely](https://github.com/koskimas/kysely)

## Table of Contents

- [kysely-migrator-cli](#kysely-migrator-cli)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
- [Usage](#usage)
  

## Installation

Explain how users can install or set up your project. Provide clear, step-by-step instructions.

```bash
# Install Kysely-migrator globally:
npm install -g kysely-migrator

```

# Usage

`kysely-migrator-cli` is a **library** designed to assist you in creating your own migration script. It does aim to provide an executables command.

To use create a json file call `migrator.json` 

```json
{
    "databaseUrl": "${DATABASE_URL}", // leave has is, there should be an env variable with the same name(your database connection)
    "migrationFolder": "./src/database/migrations" // path to your migrations folder
}
```

And it is that simple go straight ahead and create your migrations

kysely-migrator migrator:create --name test


Output:

```javascript
//file name timestamp-test.ts
// Example: creating a table
import { Kysely } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable('your_table_name')
    .addColumn('id', 'serial', (column) => column.primaryKey())
    .addColumn('name', 'text', (column) => column.notNull())
    // add more column has needed
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('your_table_name');
}

```bash
## Options

- `-V, --version`   Output the version number.
- `-h, --help`      Display help for the command.

## Commands

- `migrate:create`  Generate a migration file.
- `migrate`         Migrate to the latest version.
- `rollback`        Roll back the last migration.
- `run:migrations`  Runs all migrations that have not yet been run.
- `help [command]`  Display help for a specific command.

```
