import {
  __async
} from "../chunk-DO6NXZSM.mjs";

// src/migrations/20230913181627990-bew.ts
function up(database) {
  return __async(this, null, function* () {
    yield database.schema.createTable("bew").addColumn("id", "serial", (column) => column.primaryKey()).addColumn("name", "text", (column) => column.notNull()).execute();
  });
}
function down(database) {
  return __async(this, null, function* () {
    database.schema.dropTable("bew");
  });
}
export {
  down,
  up
};
