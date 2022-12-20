"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_users', (table) => {
        table.unique(['token']);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_users', (table) => {
        table.dropUnique(['token']);
    });
}
exports.down = down;
