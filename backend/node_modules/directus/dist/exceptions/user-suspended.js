"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSuspendedException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class UserSuspendedException extends exceptions_1.BaseException {
    constructor(message = 'User suspended.') {
        super(message, 401, 'USER_SUSPENDED');
    }
}
exports.UserSuspendedException = UserSuspendedException;
