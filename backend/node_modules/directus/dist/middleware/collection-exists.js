"use strict";
/**
 * Check if requested collection exists, and save it to req.collection
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collections_1 = require("../database/system-data/collections");
const exceptions_1 = require("../exceptions");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const collectionExists = (0, async_handler_1.default)(async (req, res, next) => {
    if (!req.params.collection)
        return next();
    if (req.params.collection in req.schema.collections === false) {
        throw new exceptions_1.ForbiddenException();
    }
    req.collection = req.params.collection;
    if (req.collection.startsWith('directus_')) {
        const systemRow = collections_1.systemCollectionRows.find((collection) => {
            return (collection === null || collection === void 0 ? void 0 : collection.collection) === req.collection;
        });
        req.singleton = !!(systemRow === null || systemRow === void 0 ? void 0 : systemRow.singleton);
    }
    else {
        req.singleton = req.schema.collections[req.collection].singleton;
    }
    return next();
});
exports.default = collectionExists;
