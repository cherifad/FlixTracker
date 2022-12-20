"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateDatabaseError = void 0;
const database_1 = __importStar(require("../../database"));
const emitter_1 = __importDefault(require("../../emitter"));
const mssql_1 = require("./dialects/mssql");
const mysql_1 = require("./dialects/mysql");
const oracle_1 = require("./dialects/oracle");
const postgres_1 = require("./dialects/postgres");
const sqlite_1 = require("./dialects/sqlite");
/**
 * Translates an error thrown by any of the databases into a pre-defined Exception. Currently
 * supports:
 * - Invalid Foreign Key
 * - Not Null Violation
 * - Record Not Unique
 * - Value Out of Range
 * - Value Too Long
 */
async function translateDatabaseError(error) {
    const client = (0, database_1.getDatabaseClient)();
    let defaultError;
    switch (client) {
        case 'mysql':
            defaultError = (0, mysql_1.extractError)(error);
            break;
        case 'cockroachdb':
        case 'postgres':
            defaultError = (0, postgres_1.extractError)(error);
            break;
        case 'sqlite':
            defaultError = (0, sqlite_1.extractError)(error);
            break;
        case 'oracle':
            defaultError = (0, oracle_1.extractError)(error);
            break;
        case 'mssql':
            defaultError = await (0, mssql_1.extractError)(error);
            break;
    }
    const hookError = await emitter_1.default.emitFilter('database.error', defaultError, { client }, {
        database: (0, database_1.default)(),
        schema: null,
        accountability: null,
    });
    return hookError;
}
exports.translateDatabaseError = translateDatabaseError;
