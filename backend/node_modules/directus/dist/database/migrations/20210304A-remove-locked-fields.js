"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_fields', (table) => {
        table.dropColumn('locked');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_fields', (table) => {
        table.boolean('locked').defaultTo(false).notNullable();
    });
}
exports.down = down;
