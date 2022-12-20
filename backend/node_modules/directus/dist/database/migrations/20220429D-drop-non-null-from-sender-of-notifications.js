"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_notifications', (table) => {
        table.setNullable('sender');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_notifications', (table) => {
        table.dropNullable('sender');
    });
}
exports.down = down;
