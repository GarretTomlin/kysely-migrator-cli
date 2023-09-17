# kysely-migrator-cli


<p align="center">

A light weight hassle free migration cli for [Kysely](https://github.com/koskimas/kysely)

  <a href="https://www.npmjs.com/package/kysely-migrator-cli?activeTab=readme">
<img alt="npm" src="https://img.shields.io/npm/dw/kysely-migrator-cli">
  </a>
</p>

## Table of Contents

- [kysely-migrator-cli](#kysely-migrator-cli)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
- [Usage](#usage)
- [NPM Package](#npm-package)
  

## Installation


```bash
# Install Kysely-migrator globally:
npm install -g kysely-migrator

or 

yarn add global kysely-migrator
```

# Usage

`kysely-migrator-cli` is a **library** designed to assist you in creating your own migration script. It does provides executables command.

To use create a json file call `migrator.json` 

```json
{
    "databaseUrl": "${DATABASE_URL}", // leave has is, there should be an env variable with the same name(your database connection)
    "migrationFolder": "src/database/migrations" // path to your migrations folder
}
```

`And it's that simple go straight ahead and create your migrations`

`migrator migrate:create test`


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

```


Help: 

```bash
## Options

- `-V, --version`   Output the version number.
- `-h, --help`      Display help for the command.

## Commands

- `migrate:create`  Generate a migration file.
- `migrate`         Migrate to the latest version.
- `migrate:down`    Roll back the last migration.
- `migrate:latest`  Runs all migrations that have not yet been run.
- `help [command]`  Display help for a specific command.

```

# NPM Package

[migrator](https://www.npmjs.com/package/kysely-migrator-cli?activeTab=readme)