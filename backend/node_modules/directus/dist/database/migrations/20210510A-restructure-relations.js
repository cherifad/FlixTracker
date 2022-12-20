"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await knex.schema.alterTable('directus_relations', (table) => {
        table.dropColumns('many_primary', 'one_primary');
        table.string('one_deselect_action').defaultTo('nullify');
    });
    await knex('directus_relations').update({ one_deselect_action: 'nullify' });
    await helper.changeToType('directus_relations', 'sort_field', 'string', {
        length: 64,
    });
    await helper.changeToType('directus_relations', 'one_deselect_action', 'string', {
        nullable: false,
        default: 'nullify',
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await helper.changeToType('directus_relations', 'sort_field', 'string', {
        length: 255,
    });
    await knex.schema.alterTable('directus_relations', (table) => {
        table.dropColumn('one_deselect_action');
        table.string('many_primary', 64);
        table.string('one_primary', 64);
    });
}
exports.down = down;
