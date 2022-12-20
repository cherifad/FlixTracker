"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordNotUniqueException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class RecordNotUniqueException extends exceptions_1.BaseException {
    constructor(field, extensions) {
        if (field) {
            super(`Field "${field}" has to be unique.`, 400, 'RECORD_NOT_UNIQUE', extensions);
        }
        else {
            super(`Field has to be unique.`, 400, 'RECORD_NOT_UNIQUE', extensions);
        }
    }
}
exports.RecordNotUniqueException = RecordNotUniqueException;
