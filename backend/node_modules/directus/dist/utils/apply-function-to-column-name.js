"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFunctionToColumnName = void 0;
const constants_1 = require("@directus/shared/constants");
/**
 * Takes in a column name, and transforms the original name with the generated column name based on
 * the applied function.
 *
 * @example
 *
 * ```js
 * applyFunctionToColumnName('year(date_created)');
 * // => "date_created_year"
 * ```
 */
function applyFunctionToColumnName(column) {
    if (column.includes('(') && column.includes(')')) {
        const functionName = column.split('(')[0];
        const columnName = column.match(constants_1.REGEX_BETWEEN_PARENS)[1];
        return `${columnName}_${functionName}`;
    }
    else {
        return column;
    }
}
exports.applyFunctionToColumnName = applyFunctionToColumnName;
