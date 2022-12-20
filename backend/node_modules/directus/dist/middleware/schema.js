"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const get_schema_1 = require("../utils/get-schema");
const schema = (0, async_handler_1.default)(async (req, res, next) => {
    req.schema = await (0, get_schema_1.getSchema)();
    return next();
});
exports.default = schema;
