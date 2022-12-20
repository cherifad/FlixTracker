"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_roles', (table) => {
        table.dropColumn('collection_list');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_roles', (table) => {
        table.json('collection_list');
    });
}
exports.down = down;
