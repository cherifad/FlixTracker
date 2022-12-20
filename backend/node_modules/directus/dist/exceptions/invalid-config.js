"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidConfigException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidConfigException extends exceptions_1.BaseException {
    constructor(message = 'Invalid config', extensions) {
        super(message, 503, 'INVALID_CONFIG', extensions);
    }
}
exports.InvalidConfigException = InvalidConfigException;
