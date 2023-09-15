import {
  __async
} from "../chunk-DO6NXZSM.mjs";

// src/migrations/20230915161025819-trying.ts
function up(database) {
  return __async(this, null, function* () {
    yield database.schema.createTable("your_table_name").addColumn("id", "serial", (column) => column.primaryKey()).addColumn("name", "text", (column) => column.notNull()).execute();
  });
}
function down(database) {
  return __async(this, null, function* () {
    database.schema.dropTable("your_table_name");
  });
}
export {
  down,
  up
};
