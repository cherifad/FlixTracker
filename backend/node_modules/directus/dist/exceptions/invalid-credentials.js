"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidCredentialsException extends exceptions_1.BaseException {
    constructor(message = 'Invalid user credentials.') {
        super(message, 401, 'INVALID_CREDENTIALS');
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
