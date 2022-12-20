"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedResponseException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class UnexpectedResponseException extends exceptions_1.BaseException {
    constructor(message) {
        super(message, 503, 'UNEXPECTED_RESPONSE');
    }
}
exports.UnexpectedResponseException = UnexpectedResponseException;
