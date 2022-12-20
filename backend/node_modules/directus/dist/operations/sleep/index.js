"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
exports.default = (0, utils_1.defineOperationApi)({
    id: 'sleep',
    handler: async ({ milliseconds }) => {
        await new Promise((resolve) => setTimeout(resolve, Number(milliseconds)));
    },
});
