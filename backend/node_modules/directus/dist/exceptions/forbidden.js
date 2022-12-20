"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class ForbiddenException extends exceptions_1.BaseException {
    constructor() {
        super(`You don't have permission to access this.`, 403, 'FORBIDDEN');
        /**
         * We currently don't show the reason for a forbidden exception in the API output, as that
         * has the potential to leak schema information (eg a "No permission" vs "No permission to files"
         * would leak that a thing called "files" exists.
         * Ref https://github.com/directus/directus/discussions/4368
         */
    }
}
exports.ForbiddenException = ForbiddenException;
