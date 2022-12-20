"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    const type = helper.isOneOfClients(['oracle', 'cockroachdb']) ? 'text' : 'string';
    await helper.changeToType('directus_webhooks', 'collections', type, {
        nullable: false,
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    const type = helper.isOneOfClients(['oracle', 'cockroachdb']) ? 'text' : 'string';
    await helper.changeToType('directus_webhooks', 'collections', type);
}
exports.down = down;
