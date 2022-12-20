"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_users', (table) => {
        table.json('auth_data');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_users', (table) => {
        table.dropColumn('auth_data');
    });
}
exports.down = down;
