"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable('directus_collections', (table) => {
        table.string('accountability').defaultTo('all');
    });
    await knex('directus_collections').update({ accountability: 'all' });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_collections', (table) => {
        table.dropColumn('accountability');
    });
}
exports.down = down;
