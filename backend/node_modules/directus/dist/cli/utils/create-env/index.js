"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const liquidjs_1 = require("liquidjs");
const nanoid_1 = require("nanoid");
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const uuid_1 = require("uuid");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const fchmod = (0, util_1.promisify)(fs_1.default.fchmod);
const open = (0, util_1.promisify)(fs_1.default.open);
const liquidEngine = new liquidjs_1.Liquid({
    extname: '.liquid',
});
const defaults = {
    security: {
        KEY: (0, uuid_1.v4)(),
        SECRET: (0, nanoid_1.nanoid)(32),
    },
};
async function createEnv(client, credentials, directory) {
    const config = {
        ...defaults,
        database: {
            DB_CLIENT: client,
        },
    };
    for (const [key, value] of Object.entries(credentials)) {
        config.database[`DB_${key.toUpperCase()}`] = value;
    }
    const configAsStrings = {};
    for (const [key, value] of Object.entries(config)) {
        configAsStrings[key] = '';
        for (const [envKey, envValue] of Object.entries(value)) {
            configAsStrings[key] += `${envKey}="${envValue}"\n`;
        }
    }
    const templateString = await readFile(path_1.default.join(__dirname, 'env-stub.liquid'), 'utf8');
    const text = await liquidEngine.parseAndRender(templateString, configAsStrings);
    await writeFile(path_1.default.join(directory, '.env'), text);
    await fchmod(await open(path_1.default.join(directory, '.env'), 'r+'), 0o640);
}
exports.default = createEnv;
