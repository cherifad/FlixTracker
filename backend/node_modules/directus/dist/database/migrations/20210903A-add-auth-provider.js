"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await knex.schema.alterTable('directus_users', (table) => {
        table.dropUnique(['email']);
    });
    await knex.schema.alterTable('directus_users', (table) => {
        table.string('provider', 128).notNullable().defaultTo('default');
        table.string('external_identifier').unique();
    });
    await helper.changeToType('directus_users', 'email', 'string', {
        nullable: true,
        length: 128,
    });
    await knex.schema.alterTable('directus_users', (table) => {
        table.unique(['email']);
    });
    await knex.schema.alterTable('directus_sessions', (table) => {
        table.json('data');
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await knex.schema.alterTable('directus_users', (table) => {
        table.dropColumn('provider');
        table.dropColumn('external_identifier');
    });
    await helper.changeToType('directus_users', 'email', 'string', {
        nullable: false,
        length: 128,
    });
    await knex.schema.alterTable('directus_sessions', (table) => {
        table.dropColumn('data');
    });
}
exports.down = down;
