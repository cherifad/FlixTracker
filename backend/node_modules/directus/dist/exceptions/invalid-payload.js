"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPayloadException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidPayloadException extends exceptions_1.BaseException {
    constructor(message, extensions) {
        super(message, 400, 'INVALID_PAYLOAD', extensions);
    }
}
exports.InvalidPayloadException = InvalidPayloadException;
