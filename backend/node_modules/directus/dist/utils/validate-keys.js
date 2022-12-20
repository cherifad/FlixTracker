"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateKeys = void 0;
const exceptions_1 = require("../exceptions");
const uuid_validate_1 = __importDefault(require("uuid-validate"));
/**
 * Validate keys based on its type
 */
function validateKeys(schema, collection, keyField, keys) {
    if (Array.isArray(keys)) {
        for (const key of keys) {
            validateKeys(schema, collection, keyField, key);
        }
    }
    else {
        const primaryKeyFieldType = schema.collections[collection].fields[keyField].type;
        if (primaryKeyFieldType === 'uuid' && !(0, uuid_validate_1.default)(String(keys))) {
            throw new exceptions_1.ForbiddenException();
        }
        else if (primaryKeyFieldType === 'integer' && !Number.isInteger(Number(keys))) {
            throw new exceptions_1.ForbiddenException();
        }
    }
}
exports.validateKeys = validateKeys;
