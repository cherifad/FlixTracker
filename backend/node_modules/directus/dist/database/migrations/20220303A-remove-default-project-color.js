"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await helper.changeToType('directus_settings', 'project_color', 'string', {
        nullable: true,
        default: null,
        length: 50,
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await helper.changeToType('directus_settings', 'project_color', 'string', {
        nullable: true,
        default: '#00C897',
        length: 10,
    });
}
exports.down = down;
