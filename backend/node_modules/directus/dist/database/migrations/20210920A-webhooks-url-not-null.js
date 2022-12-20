"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    if (helper.isOneOfClients(['oracle', 'cockroachdb'])) {
        // Oracle and Cockroach are already not nullable due to an oversight in
        // "20201105B-change-webhook-url-type.ts"
        return;
    }
    await helper.changeToType('directus_webhooks', 'url', 'string', {
        nullable: false,
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    if (helper.isOneOfClients(['oracle', 'cockroachdb'])) {
        // Oracle and Cockroach are already not nullable due to an oversight in
        // "20201105B-change-webhook-url-type.ts"
        return;
    }
    await helper.changeToType('directus_webhooks', 'url', 'string');
}
exports.down = down;
