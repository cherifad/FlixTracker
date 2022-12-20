"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteNotFoundException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class RouteNotFoundException extends exceptions_1.BaseException {
    constructor(path) {
        super(`Route ${path} doesn't exist.`, 404, 'ROUTE_NOT_FOUND');
    }
}
exports.RouteNotFoundException = RouteNotFoundException;
