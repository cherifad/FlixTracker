"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueOutOfRangeException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class ValueOutOfRangeException extends exceptions_1.BaseException {
    constructor(field, exceptions) {
        if (field) {
            super(`Numeric value in field "${field !== null && field !== void 0 ? field : ''}" is out of range.`, 400, 'VALUE_OUT_OF_RANGE', exceptions);
        }
        else {
            super(`Numeric value is out of range.`, 400, 'VALUE_OUT_OF_RANGE', exceptions);
        }
    }
}
exports.ValueOutOfRangeException = ValueOutOfRangeException;
