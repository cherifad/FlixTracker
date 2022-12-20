"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex('directus_fields').update({ interface: 'many-to-many' }).where({ interface: 'files' });
}
exports.up = up;
async function down(_knex) {
    // Do nothing
}
exports.down = down;
