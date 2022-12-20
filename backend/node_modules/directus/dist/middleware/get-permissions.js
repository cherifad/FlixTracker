"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const get_permissions_1 = require("../utils/get-permissions");
const getPermissions = (0, async_handler_1.default)(async (req, res, next) => {
    if (!req.accountability) {
        throw new Error('getPermissions middleware needs to be called after authenticate');
    }
    req.accountability.permissions = await (0, get_permissions_1.getPermissions)(req.accountability, req.schema);
    return next();
});
exports.default = getPermissions;
