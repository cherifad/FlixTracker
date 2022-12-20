"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
const services_1 = require("../../services");
const get_accountability_for_role_1 = require("../../utils/get-accountability-for-role");
exports.default = (0, utils_1.defineOperationApi)({
    id: 'item-create',
    handler: async ({ collection, payload, emitEvents, permissions }, { accountability, database, getSchema }) => {
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
        let result;
        if (!payloadObject) {
            result = null;
        }
        else {
            result = await itemsService.createMany((0, utils_1.toArray)(payloadObject), { emitEvents: !!emitEvents });
        }
        return result;
    },
});
