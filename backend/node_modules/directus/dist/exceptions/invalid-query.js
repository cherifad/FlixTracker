"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidQueryException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidQueryException extends exceptions_1.BaseException {
    constructor(message) {
        super(message, 400, 'INVALID_QUERY');
    }
}
exports.InvalidQueryException = InvalidQueryException;
