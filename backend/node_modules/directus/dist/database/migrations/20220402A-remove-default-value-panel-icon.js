"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await helper.changeToType('directus_panels', 'icon', 'string', {
        nullable: true,
        default: null,
        length: 30,
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await helper.changeToType('directus_panels', 'icon', 'string', {
        nullable: true,
        default: 'insert_chart',
        length: 30,
    });
}
exports.down = down;
