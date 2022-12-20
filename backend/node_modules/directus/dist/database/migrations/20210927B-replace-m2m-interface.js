"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex('directus_fields')
        .update({
        interface: 'files',
    })
        .where('interface', '=', 'list-m2m')
        .andWhere('special', '=', 'files');
}
exports.up = up;
async function down(knex) {
    await knex('directus_fields')
        .update({
        interface: 'list-m2m',
    })
        .where('interface', '=', 'files')
        .andWhere('special', '=', 'files');
}
exports.down = down;
