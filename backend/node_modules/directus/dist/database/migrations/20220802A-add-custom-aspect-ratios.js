"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_settings', (table) => {
        table.json('custom_aspect_ratios');
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_settings', (table) => {
        table.dropColumn('custom_aspect_ratios');
    });
}
exports.down = down;
