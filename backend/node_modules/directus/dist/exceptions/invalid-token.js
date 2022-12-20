"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidTokenException extends exceptions_1.BaseException {
    constructor(message = 'Invalid token') {
        super(message, 403, 'INVALID_TOKEN');
    }
}
exports.InvalidTokenException = InvalidTokenException;
