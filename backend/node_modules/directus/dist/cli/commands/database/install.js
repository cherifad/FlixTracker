"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const run_1 = __importDefault(require("../../../database/seeds/run"));
const database_1 = __importDefault(require("../../../database"));
const logger_1 = __importDefault(require("../../../logger"));
async function start() {
    const database = (0, database_1.default)();
    try {
        await (0, run_1.default)(database);
        database.destroy();
        process.exit(0);
    }
    catch (err) {
        logger_1.default.error(err);
        database.destroy();
        process.exit(1);
    }
}
exports.default = start;
