"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
function createDBConnection(client, credentials) {
    let connection = {};
    if (client === 'sqlite3') {
        const { filename } = credentials;
        connection = {
            filename: filename,
        };
    }
    else {
        const { host, port, database, user, password } = credentials;
        connection = {
            host: host,
            port: Number(port),
            database: database,
            user: user,
            password: password,
        };
        if (client === 'pg' || client === 'cockroachdb') {
            const { ssl } = credentials;
            connection['ssl'] = ssl;
        }
        if (client === 'mssql') {
            const { options__encrypt } = credentials;
            connection['options'] = {
                encrypt: options__encrypt,
            };
        }
    }
    const knexConfig = {
        client: client,
        connection: connection,
        seeds: {
            extension: 'js',
            directory: path_1.default.resolve(__dirname, '../../database/seeds/'),
        },
        pool: {},
    };
    if (client === 'sqlite3') {
        knexConfig.useNullAsDefault = true;
    }
    if (client === 'cockroachdb') {
        knexConfig.pool.afterCreate = async (conn, callback) => {
            const run = (0, util_1.promisify)(conn.query.bind(conn));
            await run('SET serial_normalization = "sql_sequence"');
            await run('SET default_int_size = 4');
            callback(null, conn);
        };
    }
    const db = (0, knex_1.knex)(knexConfig);
    return db;
}
exports.default = createDBConnection;
