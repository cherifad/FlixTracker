"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../database"));
const logger_1 = __importDefault(require("../../../logger"));
async function count(collection) {
    const database = (0, database_1.default)();
    if (!collection) {
        logger_1.default.error('Collection is required');
        process.exit(1);
    }
    try {
        const records = await database(collection).count('*', { as: 'count' });
        const count = Number(records[0].count);
        process.stdout.write(`${count}\n`);
        database.destroy();
        process.exit(0);
    }
    catch (err) {
        logger_1.default.error(err);
        database.destroy();
        process.exit(1);
    }
}
exports.default = count;
