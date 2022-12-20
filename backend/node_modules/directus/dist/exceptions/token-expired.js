"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenExpiredException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class TokenExpiredException extends exceptions_1.BaseException {
    constructor(message = 'Token expired.') {
        super(message, 401, 'TOKEN_EXPIRED');
    }
}
exports.TokenExpiredException = TokenExpiredException;
