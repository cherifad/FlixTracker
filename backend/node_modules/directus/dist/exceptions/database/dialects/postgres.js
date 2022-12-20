"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractError = void 0;
const contains_null_values_1 = require("../contains-null-values");
const invalid_foreign_key_1 = require("../invalid-foreign-key");
const not_null_violation_1 = require("../not-null-violation");
const record_not_unique_1 = require("../record-not-unique");
const value_out_of_range_1 = require("../value-out-of-range");
const value_too_long_1 = require("../value-too-long");
var PostgresErrorCodes;
(function (PostgresErrorCodes) {
    PostgresErrorCodes["FOREIGN_KEY_VIOLATION"] = "23503";
    PostgresErrorCodes["NOT_NULL_VIOLATION"] = "23502";
    PostgresErrorCodes["NUMERIC_VALUE_OUT_OF_RANGE"] = "22003";
    PostgresErrorCodes["UNIQUE_VIOLATION"] = "23505";
    PostgresErrorCodes["VALUE_LIMIT_VIOLATION"] = "22001";
})(PostgresErrorCodes || (PostgresErrorCodes = {}));
function extractError(error) {
    switch (error.code) {
        case PostgresErrorCodes.UNIQUE_VIOLATION:
            return uniqueViolation(error);
        case PostgresErrorCodes.NUMERIC_VALUE_OUT_OF_RANGE:
            return numericValueOutOfRange(error);
        case PostgresErrorCodes.VALUE_LIMIT_VIOLATION:
            return valueLimitViolation(error);
        case PostgresErrorCodes.NOT_NULL_VIOLATION:
            return notNullViolation(error);
        case PostgresErrorCodes.FOREIGN_KEY_VIOLATION:
            return foreignKeyViolation(error);
        default:
            return error;
    }
}
exports.extractError = extractError;
function uniqueViolation(error) {
    const { table, detail } = error;
    const betweenParens = /\(([^)]+)\)/g;
    const matches = detail.match(betweenParens);
    if (!matches)
        return error;
    const collection = table;
    const field = matches[0].slice(1, -1);
    const invalid = matches[1].slice(1, -1);
    return new record_not_unique_1.RecordNotUniqueException(field, {
        collection,
        field,
        invalid,
    });
}
function numericValueOutOfRange(error) {
    const regex = /"(.*?)"/g;
    const matches = error.message.match(regex);
    if (!matches)
        return error;
    const collection = matches[0].slice(1, -1);
    const field = null;
    const invalid = matches[2].slice(1, -1);
    return new value_out_of_range_1.ValueOutOfRangeException(field, {
        collection,
        field,
        invalid,
    });
}
function valueLimitViolation(error) {
    /**
     * NOTE:
     * Postgres doesn't return the offending column
     */
    const regex = /"(.*?)"/g;
    const matches = error.message.match(regex);
    if (!matches)
        return error;
    const collection = matches[0].slice(1, -1);
    const field = null;
    return new value_too_long_1.ValueTooLongException(field, {
        collection,
        field,
    });
}
function notNullViolation(error) {
    const { table, column } = error;
    if (!column)
        return error;
    if (error.message.endsWith('contains null values')) {
        return new contains_null_values_1.ContainsNullValuesException(column, { collection: table, field: column });
    }
    return new not_null_violation_1.NotNullViolationException(column, {
        collection: table,
        field: column,
    });
}
function foreignKeyViolation(error) {
    const { table, detail } = error;
    const betweenParens = /\(([^)]+)\)/g;
    const matches = detail.match(betweenParens);
    if (!matches)
        return error;
    const collection = table;
    const field = matches[0].slice(1, -1);
    const invalid = matches[1].slice(1, -1);
    return new invalid_foreign_key_1.InvalidForeignKeyException(field, {
        collection,
        field,
        invalid,
    });
}
