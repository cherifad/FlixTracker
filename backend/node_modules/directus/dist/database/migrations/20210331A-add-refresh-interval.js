"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_presets', (table) => {
        table.integer('refresh_interval');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_presets', (table) => {
        table.dropColumn('refresh_interval');
    });
}
exports.down = down;
