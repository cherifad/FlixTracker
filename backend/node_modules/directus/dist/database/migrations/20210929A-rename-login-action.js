"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex('directus_activity')
        .update({
        action: 'login',
    })
        .where('action', '=', 'authenticate');
}
exports.up = up;
async function down(knex) {
    await knex('directus_activity')
        .update({
        action: 'authenticate',
    })
        .where('action', '=', 'login');
}
exports.down = down;
