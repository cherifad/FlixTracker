"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
const env_1 = __importDefault(require("../env"));
const logger_1 = __importDefault(require("../logger"));
const get_local_type_1 = __importDefault(require("./get-local-type"));
function getDefaultValue(column) {
    var _a;
    const type = (0, get_local_type_1.default)(column);
    const defaultValue = (_a = column.default_value) !== null && _a !== void 0 ? _a : null;
    if (defaultValue === null)
        return null;
    if (defaultValue === '0000-00-00 00:00:00')
        return null;
    switch (type) {
        case 'bigInteger':
        case 'integer':
        case 'decimal':
        case 'float':
            return Number.isNaN(Number(defaultValue)) === false ? Number(defaultValue) : defaultValue;
        case 'boolean':
            return castToBoolean(defaultValue);
        case 'json':
            return castToObject(defaultValue);
        default:
            return defaultValue;
    }
}
exports.default = getDefaultValue;
function castToBoolean(value) {
    if (typeof value === 'boolean')
        return value;
    if (value === 0 || value === '0')
        return false;
    if (value === 1 || value === '1')
        return true;
    if (value === 'false' || value === false)
        return false;
    if (value === 'true' || value === true)
        return true;
    return Boolean(value);
}
function castToObject(value) {
    if (!value)
        return value;
    if (typeof value === 'object')
        return value;
    if (typeof value === 'string') {
        try {
            return (0, utils_1.parseJSON)(value);
        }
        catch (err) {
            if (env_1.default.NODE_ENV === 'development') {
                logger_1.default.error(err);
            }
            return value;
        }
    }
    return {};
}
