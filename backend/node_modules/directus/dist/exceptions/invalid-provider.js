"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidProviderException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidProviderException extends exceptions_1.BaseException {
    constructor(message = 'Invalid provider.') {
        super(message, 403, 'INVALID_PROVIDER');
    }
}
exports.InvalidProviderException = InvalidProviderException;
