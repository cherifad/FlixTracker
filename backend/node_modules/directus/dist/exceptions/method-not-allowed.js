"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodNotAllowedException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class MethodNotAllowedException extends exceptions_1.BaseException {
    constructor(message = 'Method not allowed.', extensions) {
        super(message, 405, 'METHOD_NOT_ALLOWED', extensions);
    }
}
exports.MethodNotAllowedException = MethodNotAllowedException;
