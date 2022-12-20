"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const utils_1 = require("@directus/shared/utils");
async function up(knex) {
    const groups = await knex.select('*').from('directus_fields').where({ interface: 'group-standard' });
    const raw = [];
    const detail = [];
    for (const group of groups) {
        const options = typeof group.options === 'string' ? (0, utils_1.parseJSON)(group.options) : group.options || {};
        if (options.showHeader === true) {
            detail.push(group);
        }
        else {
            raw.push(group);
        }
    }
    for (const field of raw) {
        await knex('directus_fields').update({ interface: 'group-raw' }).where({ id: field.id });
    }
    for (const field of detail) {
        await knex('directus_fields').update({ interface: 'group-detail' }).where({ id: field.id });
    }
}
exports.up = up;
async function down(knex) {
    await knex('directus_fields')
        .update({
        interface: 'group-standard',
    })
        .where({ interface: 'group-detail' })
        .orWhere({ interface: 'group-raw' });
}
exports.down = down;
