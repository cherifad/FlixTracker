"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await knex.schema.alterTable('directus_settings', (table) => {
        table.string('default_language').notNullable().defaultTo('en-US');
    });
    await helper.changeToType('directus_users', 'language', 'string', {
        nullable: true,
        default: null,
        length: 255,
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await knex.schema.alterTable('directus_settings', (table) => {
        table.dropColumn('default_language');
    });
    await helper.changeToType('directus_users', 'language', 'string', {
        nullable: true,
        default: 'en-US',
        length: 255,
    });
}
exports.down = down;
