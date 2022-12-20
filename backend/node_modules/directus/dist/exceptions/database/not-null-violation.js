"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotNullViolationException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class NotNullViolationException extends exceptions_1.BaseException {
    constructor(field, exceptions) {
        super(`Value for field "${field}" can't be null.`, 400, 'NOT_NULL_VIOLATION', exceptions);
    }
}
exports.NotNullViolationException = NotNullViolationException;
