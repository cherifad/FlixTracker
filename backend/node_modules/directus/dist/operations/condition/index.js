"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
exports.default = (0, utils_1.defineOperationApi)({
    id: 'condition',
    handler: ({ filter }, { data }) => {
        const errors = (0, utils_1.validatePayload)(filter, data, { requireAll: true });
        if (errors.length > 0) {
            throw errors;
        }
        else {
            return null;
        }
    },
});
