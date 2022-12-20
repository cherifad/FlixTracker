"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const utils_1 = require("@directus/shared/utils");
const logger_1 = __importDefault(require("../../logger"));
async function up(knex) {
    const dividerGroups = await knex.select('*').from('directus_fields').where('interface', '=', 'group-divider');
    for (const dividerGroup of dividerGroups) {
        const newOptions = { showHeader: true };
        if (dividerGroup.options) {
            try {
                const options = typeof dividerGroup.options === 'string' ? (0, utils_1.parseJSON)(dividerGroup.options) : dividerGroup.options;
                if (options.icon)
                    newOptions.headerIcon = options.icon;
                if (options.color)
                    newOptions.headerColor = options.color;
            }
            catch (err) {
                logger_1.default.warn(`Couldn't convert previous options from field ${dividerGroup.collection}.${dividerGroup.field}`);
                logger_1.default.warn(err);
            }
        }
        try {
            await knex('directus_fields')
                .update({
                interface: 'group-standard',
                options: JSON.stringify(newOptions),
            })
                .where('id', '=', dividerGroup.id);
        }
        catch (err) {
            logger_1.default.warn(`Couldn't update ${dividerGroup.collection}.${dividerGroup.field} to new group interface`);
            logger_1.default.warn(err);
        }
    }
    await knex('directus_fields')
        .update({
        interface: 'group-standard',
    })
        .where({ interface: 'group-raw' });
}
exports.up = up;
async function down(knex) {
    await knex('directus_fields')
        .update({
        interface: 'group-raw',
    })
        .where('interface', '=', 'group-standard');
}
exports.down = down;
