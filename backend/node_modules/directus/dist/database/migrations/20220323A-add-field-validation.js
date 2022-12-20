"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_fields', (table) => {
        table.json('validation');
        table.text('validation_message');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_fields', (table) => {
        table.dropColumn('validation');
        table.dropColumn('validation_message');
    });
}
exports.down = down;
