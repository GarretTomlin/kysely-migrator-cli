import { Kysely } from 'kysely';
  
  export async function up(database: Kysely<unknown>): Promise<void> {
    await database.schema
      .createTable('bew')
      .addColumn('id', 'serial', (column) => column.primaryKey())
      .addColumn('name', 'text', (column) => column.notNull())
      .execute();
  }
  
  export async function down(database: Kysely<unknown>): Promise<void> {
    database.schema.dropTable('bew');
  }
  