"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    if (helper.isOneOfClients(['oracle', 'cockroachdb'])) {
        return;
    }
    await knex.schema.alterTable('directus_files', (table) => {
        table.bigInteger('filesize').nullable().defaultTo(null).alter();
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    if (helper.isOneOfClients(['oracle', 'cockroachdb'])) {
        return;
    }
    await knex.schema.alterTable('directus_files', (table) => {
        table.integer('filesize').nullable().defaultTo(null).alter();
    });
}
exports.down = down;
