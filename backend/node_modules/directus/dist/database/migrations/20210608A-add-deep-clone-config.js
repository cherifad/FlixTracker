"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_collections', (table) => {
        table.json('item_duplication_fields').nullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_collections', (table) => {
        table.dropColumn('item_duplication_fields');
    });
}
exports.down = down;
