"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userName = void 0;
function userName(user) {
    if (!user) {
        return 'Unknown User';
    }
    if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) {
        return user.first_name;
    }
    if (user.email) {
        return user.email;
    }
    return 'Unknown User';
}
exports.userName = userName;
