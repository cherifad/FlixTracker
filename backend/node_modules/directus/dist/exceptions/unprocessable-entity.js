"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class UnprocessableEntityException extends exceptions_1.BaseException {
    constructor(message) {
        super(message, 422, 'UNPROCESSABLE_ENTITY');
    }
}
exports.UnprocessableEntityException = UnprocessableEntityException;
