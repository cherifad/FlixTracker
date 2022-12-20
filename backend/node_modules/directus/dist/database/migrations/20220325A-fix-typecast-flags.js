"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const utils_1 = require("@directus/shared/utils");
const lodash_1 = require("lodash");
async function up(knex) {
    const fields = await knex
        .select('id', 'special')
        .from('directus_fields')
        .whereNotNull('special')
        .orWhere('special', '<>', '');
    for (const { id, special } of fields) {
        let parsedSpecial;
        try {
            if (special.includes('{')) {
                // Fix invalid data in Postgres
                parsedSpecial = (0, utils_1.toArray)(special.replace(/{/g, '').replace(/}/g, '').replace(/"/g, ''));
            }
            else {
                parsedSpecial = (0, utils_1.toArray)(special);
            }
        }
        catch {
            continue;
        }
        if (parsedSpecial && (0, lodash_1.isArray)(parsedSpecial)) {
            // Perform the update again in case it was not performed prior
            parsedSpecial = parsedSpecial.map((special) => {
                switch (special) {
                    case 'boolean':
                    case 'csv':
                    case 'json':
                        return 'cast-' + special;
                    default:
                        return special;
                }
            });
            const parsedSpecialString = parsedSpecial.join(',');
            if (parsedSpecialString !== special) {
                await knex('directus_fields').update({ special: parsedSpecialString }).where({ id });
            }
        }
    }
}
exports.up = up;
async function down(_knex) {
    // Do nothing
}
exports.down = down;
