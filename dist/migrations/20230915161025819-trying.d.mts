import { Kysely } from 'kysely';

declare function up(database: Kysely<unknown>): Promise<void>;
declare function down(database: Kysely<unknown>): Promise<void>;

export { down, up };
