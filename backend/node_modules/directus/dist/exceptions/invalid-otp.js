"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOTPException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidOTPException extends exceptions_1.BaseException {
    constructor(message = 'Invalid user OTP.') {
        super(message, 401, 'INVALID_OTP');
    }
}
exports.InvalidOTPException = InvalidOTPException;
