"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/commands/migrate-create.ts
var migrate_create_exports = {};
__export(migrate_create_exports, {
  default: () => migrate_create_default
});
module.exports = __toCommonJS(migrate_create_exports);
var import_promises = __toESM(require("fs/promises"));
var import_path2 = __toESM(require("path"));

// src/config/migrator-config.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function getConfig() {
  try {
    const configPath = import_path.default.resolve(process.cwd(), "migrator.json");
    const rawConfig = import_fs.default.readFileSync(configPath, "utf8");
    return JSON.parse(rawConfig);
  } catch (error) {
    console.error("Error loading configuration:", error);
    process.exit(1);
  }
}
var migrator_config_default = getConfig;

// src/commands/migrate-create.ts
var generateMigration = {
  name: "migrate:create",
  alias: ["create"],
  description: "Generate a migration file (--name)",
  run: (toolbox) => __async(void 0, null, function* () {
    const { print, parameters } = toolbox;
    const migrationName = parameters.first;
    if (!migrationName) {
      print.error("Please specify a migration name.");
      return;
    }
    const config = migrator_config_default();
    const destination = config.migrationFolder;
    const migrationFolder = import_path2.default.join(process.cwd(), destination);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[^0-9]/g, "");
    const fileName = `${timestamp}-${migrationName}.ts`;
    const migrationContent = `
    // Example: creating a table
    import { Kysely } from 'kysely';
    
    export async function up(database: Kysely<unknown>): Promise<void> {
      await database.schema
        .createTable('your_table_name')
        .addColumn('id', 'serial', (column) => column.primaryKey())
        .addColumn('name', 'text', (column) => column.notNull())
        // add more columns as needed
        .execute();
    }
    
    export async function down(database: Kysely<unknown>): Promise<void> {
      database.schema.dropTable('your_table_name');
    }
    `;
    try {
      yield import_promises.default.mkdir(migrationFolder, { recursive: true });
      yield import_promises.default.writeFile(
        import_path2.default.join(migrationFolder, fileName),
        migrationContent
      );
      print.info(`Migration file generated: ${fileName}`);
      print.info(`Migration file generated at: ${import_path2.default.join(migrationFolder, fileName)}`);
    } catch (error) {
      print.error("Failed to generate migration:");
    }
  })
};
var migrate_create_default = generateMigration;
