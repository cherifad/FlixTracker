"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainsNullValuesException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class ContainsNullValuesException extends exceptions_1.BaseException {
    constructor(field, exceptions) {
        super(`Field "${field}" contains null values.`, 400, 'CONTAINS_NULL_VALUES', exceptions);
    }
}
exports.ContainsNullValuesException = ContainsNullValuesException;
