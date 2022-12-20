"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidForeignKeyException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class InvalidForeignKeyException extends exceptions_1.BaseException {
    constructor(field, extensions) {
        if (field) {
            super(`Invalid foreign key in field "${field}".`, 400, 'INVALID_FOREIGN_KEY', extensions);
        }
        else {
            super(`Invalid foreign key.`, 400, 'INVALID_FOREIGN_KEY', extensions);
        }
    }
}
exports.InvalidForeignKeyException = InvalidForeignKeyException;
