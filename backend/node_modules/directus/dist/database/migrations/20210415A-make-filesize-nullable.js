"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const helpers_1 = require("../helpers");
async function up(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await helper.changeToType('directus_files', 'filesize', 'integer', {
        nullable: true,
        default: null,
    });
}
exports.up = up;
async function down(knex) {
    const helper = (0, helpers_1.getHelpers)(knex).schema;
    await helper.changeToType('directus_files', 'filesize', 'integer', {
        nullable: false,
        default: 0,
    });
}
exports.down = down;
