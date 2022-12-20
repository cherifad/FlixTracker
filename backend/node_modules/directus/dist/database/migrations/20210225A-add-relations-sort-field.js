"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const utils_1 = require("@directus/shared/utils");
async function up(knex) {
    var _a;
    await knex.schema.alterTable('directus_relations', (table) => {
        table.string('sort_field');
    });
    const fieldsWithSort = await knex
        .select('collection', 'field', 'options')
        .from('directus_fields')
        .whereIn('interface', ['one-to-many', 'm2a-builder', 'many-to-many']);
    for (const field of fieldsWithSort) {
        const options = typeof field.options === 'string' ? (0, utils_1.parseJSON)(field.options) : (_a = field.options) !== null && _a !== void 0 ? _a : {};
        if ('sortField' in options) {
            await knex('directus_relations')
                .update({
                sort_field: options.sortField,
            })
                .where({
                one_collection: field.collection,
                one_field: field.field,
            });
        }
    }
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable('directus_relations', (table) => {
        table.dropColumn('sort_field');
    });
}
exports.down = down;
