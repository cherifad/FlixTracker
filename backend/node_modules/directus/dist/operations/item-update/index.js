"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
const services_1 = require("../../services");
const get_accountability_for_role_1 = require("../../utils/get-accountability-for-role");
const sanitize_query_1 = require("../../utils/sanitize-query");
exports.default = (0, utils_1.defineOperationApi)({
    id: 'item-update',
    handler: async ({ collection, key, payload, query, emitEvents, permissions }, { accountability, database, getSchema }) => {
        var _a;
        const schema = await getSchema({ database });
        let customAccountability;
        if (!permissions || permissions === '$trigger') {
            customAccountability = accountability;
        }
        else if (permissions === '$full') {
            customAccountability = await (0, get_accountability_for_role_1.getAccountabilityForRole)('system', { database, schema, accountability });
        }
        else if (permissions === '$public') {
            customAccountability = await (0, get_accountability_for_role_1.getAccountabilityForRole)(null, { database, schema, accountability });
        }
        else {
            customAccountability = await (0, get_accountability_for_role_1.getAccountabilityForRole)(permissions, { database, schema, accountability });
        }
        const itemsService = new services_1.ItemsService(collection, {
            schema: await getSchema({ database }),
            accountability: customAccountability,
            knex: database,
        });
        const payloadObject = (_a = (0, utils_1.optionToObject)(payload)) !== null && _a !== void 0 ? _a : null;
        const queryObject = query ? (0, utils_1.optionToObject)(query) : {};
        const sanitizedQueryObject = (0, sanitize_query_1.sanitizeQuery)(queryObject, customAccountability);
        if (!payloadObject) {
            return null;
        }
        let result;
        if (!key || (Array.isArray(key) && key.length === 0)) {
            result = await itemsService.updateByQuery(sanitizedQueryObject, payloadObject, { emitEvents: !!emitEvents });
        }
        else {
            const keys = (0, utils_1.toArray)(key);
            if (keys.length === 1) {
                result = await itemsService.updateOne(keys[0], payloadObject, { emitEvents: !!emitEvents });
            }
            else {
                result = await itemsService.updateMany(keys, payloadObject, { emitEvents: !!emitEvents });
            }
        }
        return result;
    },
});
