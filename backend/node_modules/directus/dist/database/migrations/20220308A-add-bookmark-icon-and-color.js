"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_presets', (table) => {
        table.string('icon', 30).notNullable().defaultTo('bookmark_outline');
        table.string('color').nullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_presets', (table) => {
        table.dropColumn('icon');
        table.dropColumn('color');
    });
}
exports.down = down;
