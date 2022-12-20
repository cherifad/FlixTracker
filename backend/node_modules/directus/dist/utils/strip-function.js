"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripFunction = void 0;
const constants_1 = require("@directus/shared/constants");
/**
 * Strip the function declarations from a list of fields
 */
function stripFunction(field) {
    if (field.includes('(') && field.includes(')')) {
        return field.match(constants_1.REGEX_BETWEEN_PARENS)[1].trim();
    }
    else {
        return field;
    }
}
exports.stripFunction = stripFunction;
