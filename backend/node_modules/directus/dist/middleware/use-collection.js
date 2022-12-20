"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const useCollection = (collection) => (0, async_handler_1.default)(async (req, res, next) => {
    req.collection = collection;
    next();
});
exports.default = useCollection;
