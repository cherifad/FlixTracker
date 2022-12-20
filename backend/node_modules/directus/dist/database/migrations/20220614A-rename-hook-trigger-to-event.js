"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex('directus_flows').update({ trigger: 'event' }).where('trigger', '=', 'hook');
}
exports.up = up;
async function down(knex) {
    await knex('directus_flows').update({ trigger: 'hook' }).where('trigger', '=', 'event');
}
exports.down = down;
