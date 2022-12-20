"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
exports.default = (0, utils_1.defineOperationApi)({
    id: 'transform',
    handler: ({ json }) => {
        return (0, utils_1.optionToObject)(json);
    },
});
