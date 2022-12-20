"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedMediaTypeException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class UnsupportedMediaTypeException extends exceptions_1.BaseException {
    constructor(message, extensions) {
        super(message, 415, 'UNSUPPORTED_MEDIA_TYPE', extensions);
    }
}
exports.UnsupportedMediaTypeException = UnsupportedMediaTypeException;
