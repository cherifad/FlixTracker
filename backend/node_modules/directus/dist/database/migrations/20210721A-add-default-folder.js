"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const get_default_index_name_1 = require("../../utils/get-default-index-name");
const indexName = (0, get_default_index_name_1.getDefaultIndexName)('foreign', 'directus_settings', 'storage_default_folder');
async function up(knex) {
    await knex.schema.alterTable('directus_settings', (table) => {
        table
            .uuid('storage_default_folder')
            .references('id')
            .inTable('directus_folders')
            .withKeyName(indexName)
            .onDelete('SET NULL');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_files', (table) => {
        table.dropForeign(['storage_default_folder'], indexName);
        table.dropColumn('storage_default_folder');
    });
}
exports.down = down;
