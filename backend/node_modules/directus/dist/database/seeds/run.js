"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../helpers");
async function runSeed(database) {
    const helpers = (0, helpers_1.getHelpers)(database);
    const exists = await database.schema.hasTable('directus_collections');
    if (exists) {
        throw new Error('Database is already installed');
    }
    const tableSeeds = await fs_extra_1.default.readdir(path_1.default.resolve(__dirname));
    for (const tableSeedFile of tableSeeds) {
        if (tableSeedFile.startsWith('run'))
            continue;
        const yamlRaw = await fs_extra_1.default.readFile(path_1.default.resolve(__dirname, tableSeedFile), 'utf8');
        const seedData = js_yaml_1.default.load(yamlRaw);
        await database.schema.createTable(seedData.table, (tableBuilder) => {
            var _a;
            for (const [columnName, columnInfo] of Object.entries(seedData.columns)) {
                let column;
                if (columnInfo.type === 'alias' || columnInfo.type === 'unknown')
                    return;
                if (columnInfo.type === 'string') {
                    column = tableBuilder.string(columnName, columnInfo.length);
                }
                else if (columnInfo.increments) {
                    column = tableBuilder.increments();
                }
                else if (columnInfo.type === 'csv') {
                    column = tableBuilder.string(columnName);
                }
                else if (columnInfo.type === 'hash') {
                    column = tableBuilder.string(columnName, 255);
                }
                else if ((_a = columnInfo.type) === null || _a === void 0 ? void 0 : _a.startsWith('geometry')) {
                    column = helpers.st.createColumn(tableBuilder, { field: columnName, type: columnInfo.type });
                }
                else {
                    // @ts-ignore
                    column = tableBuilder[columnInfo.type](columnName);
                }
                if (columnInfo.primary) {
                    column.primary();
                }
                if (columnInfo.nullable !== undefined && columnInfo.nullable === false) {
                    column.notNullable();
                }
                if (columnInfo.default !== undefined) {
                    let defaultValue = columnInfo.default;
                    if ((0, lodash_1.isObject)(defaultValue) || Array.isArray(defaultValue)) {
                        defaultValue = JSON.stringify(defaultValue);
                    }
                    if (defaultValue === '$now') {
                        defaultValue = database.fn.now();
                    }
                    column.defaultTo(defaultValue);
                }
                if (columnInfo.unique) {
                    column.unique();
                }
                if (columnInfo.unsigned) {
                    column.unsigned();
                }
                if (columnInfo.references) {
                    column.references(columnInfo.references.column).inTable(columnInfo.references.table);
                }
            }
        });
    }
}
exports.default = runSeed;
