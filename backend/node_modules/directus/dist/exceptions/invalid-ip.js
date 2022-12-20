"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidIPException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidIPException extends exceptions_1.BaseException {
    constructor(message = 'Invalid IP address.') {
        super(message, 401, 'INVALID_IP');
    }
}
exports.InvalidIPException = InvalidIPException;
