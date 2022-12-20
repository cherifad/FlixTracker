"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_settings', (table) => {
        table.string('project_descriptor', 100).nullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_settings', (table) => {
        table.dropColumn('project_descriptor');
    });
}
exports.down = down;
