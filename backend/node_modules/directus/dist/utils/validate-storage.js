"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStorage = void 0;
const env_1 = __importDefault(require("../env"));
const logger_1 = __importDefault(require("../logger"));
const fs_extra_1 = require("fs-extra");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const utils_1 = require("@directus/shared/utils");
async function validateStorage() {
    if (env_1.default.DB_CLIENT === 'sqlite3') {
        try {
            await (0, fs_extra_1.access)(path_1.default.dirname(env_1.default.DB_FILENAME), fs_1.constants.R_OK | fs_1.constants.W_OK);
        }
        catch {
            logger_1.default.warn(`Directory for SQLite database file (${path_1.default.resolve(path_1.default.dirname(env_1.default.DB_FILENAME))}) is not read/writeable!`);
        }
    }
    const usedStorageDrivers = (0, utils_1.toArray)(env_1.default.STORAGE_LOCATIONS).map((location) => env_1.default[`STORAGE_${location.toUpperCase()}_DRIVER`]);
    if (usedStorageDrivers.includes('local')) {
        try {
            await (0, fs_extra_1.access)(env_1.default.STORAGE_LOCAL_ROOT, fs_1.constants.R_OK | fs_1.constants.W_OK);
        }
        catch {
            logger_1.default.warn(`Upload directory (${path_1.default.resolve(env_1.default.STORAGE_LOCAL_ROOT)}) is not read/writeable!`);
        }
    }
    try {
        await (0, fs_extra_1.access)(env_1.default.EXTENSIONS_PATH, fs_1.constants.R_OK);
    }
    catch {
        logger_1.default.warn(`Extensions directory (${path_1.default.resolve(env_1.default.EXTENSIONS_PATH)}) is not readable!`);
    }
}
exports.validateStorage = validateStorage;
