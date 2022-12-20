"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitRateLimitException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class HitRateLimitException extends exceptions_1.BaseException {
    constructor(message, extensions) {
        super(message, 429, 'REQUESTS_EXCEEDED', extensions);
    }
}
exports.HitRateLimitException = HitRateLimitException;
