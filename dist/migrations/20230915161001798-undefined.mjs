import {
  __async
} from "../chunk-DO6NXZSM.mjs";

// src/migrations/20230915161001798-undefined.ts
function up(database) {
  return __async(this, null, function* () {
    yield database.schema.createTable("your_tfe_name").addColumn("id", "serial", (column) => column.primaryKey()).addColumn("name", "text", (column) => column.notNull()).execute();
  });
}
function down(database) {
  return __async(this, null, function* () {
    database.schema.dropTable("your_tfe_name");
  });
}
export {
  down,
  up
};
