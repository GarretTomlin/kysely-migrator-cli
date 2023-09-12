// // Example: creating a table
// import { Kysely } from 'kysely';

// export async function up(database: Kysely<unknown>): Promise<void> {
//   await database.schema
//     .createTable('test')
//     .addColumn('id', 'serial', (column) => column.primaryKey())
//     .addColumn('name', 'text', (column) => column.notNull())
//     // add more column has needed
//     .execute();
// }

// export async function down(database: Kysely<unknown>): Promise<void> {
//  database.schema.dropTable('test');
// }
