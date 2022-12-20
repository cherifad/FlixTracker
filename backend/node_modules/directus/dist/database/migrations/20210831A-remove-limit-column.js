"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_permissions', (table) => {
        table.dropColumn('limit');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_permissions', (table) => {
        table.integer('limit').unsigned();
    });
}
exports.down = down;
