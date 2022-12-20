"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_schema_1 = require("../../../utils/get-schema");
const generate_hash_1 = require("../../../utils/generate-hash");
const services_1 = require("../../../services");
const database_1 = __importDefault(require("../../../database"));
const logger_1 = __importDefault(require("../../../logger"));
async function usersPasswd({ email, password }) {
    const database = (0, database_1.default)();
    if (!email || !password) {
        logger_1.default.error('Email and password are required');
        process.exit(1);
    }
    try {
        const passwordHashed = await (0, generate_hash_1.generateHash)(password);
        const schema = await (0, get_schema_1.getSchema)();
        const service = new services_1.UsersService({ schema, knex: database });
        const user = await service.knex
            .select('id')
            .from('directus_users')
            .whereRaw('LOWER(??) = ?', ['email', email.toLowerCase()])
            .first();
        if (user) {
            await service.knex('directus_users').update({ password: passwordHashed }).where({ id: user.id });
            logger_1.default.info(`Password is updated for user ${user.id}`);
        }
        else {
            logger_1.default.error('No such user by this email');
        }
        await database.destroy();
        process.exit(user ? 0 : 1);
    }
    catch (err) {
        logger_1.default.error(err);
        process.exit(1);
    }
}
exports.default = usersPasswd;
