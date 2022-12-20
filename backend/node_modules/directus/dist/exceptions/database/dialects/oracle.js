"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractError = void 0;
const contains_null_values_1 = require("../contains-null-values");
var OracleErrorCodes;
(function (OracleErrorCodes) {
    OracleErrorCodes[OracleErrorCodes["CONTAINS_NULL_VALUES"] = 2296] = "CONTAINS_NULL_VALUES";
    // @TODO extend with other errors
})(OracleErrorCodes || (OracleErrorCodes = {}));
function extractError(error) {
    switch (error.errorNum) {
        case OracleErrorCodes.CONTAINS_NULL_VALUES:
            return containsNullValues(error);
        default:
            return error;
    }
}
exports.extractError = extractError;
function containsNullValues(error) {
    const betweenQuotes = /"([^"]+)"/g;
    const matches = error.message.match(betweenQuotes);
    if (!matches)
        return error;
    const collection = matches[0].slice(1, -1);
    const field = matches[1].slice(1, -1);
    return new contains_null_values_1.ContainsNullValuesException(field, { collection, field });
}
