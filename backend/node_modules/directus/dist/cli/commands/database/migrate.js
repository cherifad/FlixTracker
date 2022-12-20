"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const run_1 = __importDefault(require("../../../database/migrations/run"));
const database_1 = __importDefault(require("../../../database"));
const logger_1 = __importDefault(require("../../../logger"));
async function migrate(direction) {
    const database = (0, database_1.default)();
    try {
        logger_1.default.info('Running migrations...');
        await (0, run_1.default)(database, direction);
        if (direction === 'down') {
            logger_1.default.info('Downgrade successful');
        }
        else {
            logger_1.default.info('Database up to date');
        }
        database.destroy();
        process.exit();
    }
    catch (err) {
        logger_1.default.error(err);
        database.destroy();
        process.exit(1);
    }
}
exports.default = migrate;
