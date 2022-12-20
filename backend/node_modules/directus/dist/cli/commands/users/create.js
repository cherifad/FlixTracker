"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_schema_1 = require("../../../utils/get-schema");
const services_1 = require("../../../services");
const database_1 = __importDefault(require("../../../database"));
const logger_1 = __importDefault(require("../../../logger"));
async function usersCreate({ email, password, role, }) {
    const database = (0, database_1.default)();
    if (!email || !password || !role) {
        logger_1.default.error('Email, password, role are required');
        process.exit(1);
    }
    try {
        const schema = await (0, get_schema_1.getSchema)();
        const service = new services_1.UsersService({ schema, knex: database });
        const id = await service.createOne({ email, password, role, status: 'active' });
        process.stdout.write(`${String(id)}\n`);
        database.destroy();
        process.exit(0);
    }
    catch (err) {
        logger_1.default.error(err);
        process.exit(1);
    }
}
exports.default = usersCreate;
