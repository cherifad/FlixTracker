"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_activity', (table) => {
        table.string('origin').nullable();
    });
    await knex.schema.alterTable('directus_sessions', (table) => {
        table.string('origin').nullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_activity', (table) => {
        table.dropColumn('origin');
    });
    await knex.schema.alterTable('directus_sessions', (table) => {
        table.dropColumn('origin');
    });
}
exports.down = down;
