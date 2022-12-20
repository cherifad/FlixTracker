"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
const services_1 = require("../../services");
const get_accountability_for_role_1 = require("../../utils/get-accountability-for-role");
exports.default = (0, utils_1.defineOperationApi)({
    id: 'notification',
    handler: async ({ recipient, subject, message, permissions }, { accountability, database, getSchema }) => {
        const schema = await getSchema({ database });
        let customAccountability;
        if (!permissions || permissions === '$trigger') {
            customAccountability = accountability;
        }
        else if (permissions === '$full') {
            customAccountability = null;
        }
        else if (permissions === '$public') {
            customAccountability = await (0, get_accountability_for_role_1.getAccountabilityForRole)(null, { database, schema, accountability });
        }
        else {
            customAccountability = await (0, get_accountability_for_role_1.getAccountabilityForRole)(permissions, { database, schema, accountability });
        }
        const notificationsService = new services_1.NotificationsService({
            schema: await getSchema({ database }),
            accountability: customAccountability,
            knex: database,
        });
        const messageString = message ? (0, utils_1.optionToString)(message) : null;
        const payload = (0, utils_1.toArray)(recipient).map((userId) => {
            var _a;
            return {
                recipient: userId,
                sender: (_a = customAccountability === null || customAccountability === void 0 ? void 0 : customAccountability.user) !== null && _a !== void 0 ? _a : null,
                subject,
                message: messageString,
            };
        });
        const result = await notificationsService.createMany(payload);
        return result;
    },
});
