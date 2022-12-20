"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class ServiceUnavailableException extends exceptions_1.BaseException {
    constructor(message, extensions) {
        super(message, 503, 'SERVICE_UNAVAILABLE', extensions);
    }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
