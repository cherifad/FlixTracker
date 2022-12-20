"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = void 0;
const argon2_1 = __importDefault(require("argon2"));
const get_config_from_env_1 = require("./get-config-from-env");
function generateHash(stringToHash) {
    const argon2HashConfigOptions = (0, get_config_from_env_1.getConfigFromEnv)('HASH_', 'HASH_RAW'); // Disallow the HASH_RAW option, see https://github.com/directus/directus/discussions/7670#discussioncomment-1255805
    // associatedData, if specified, must be passed as a Buffer to argon2.hash, see https://github.com/ranisalt/node-argon2/wiki/Options#associateddata
    'associatedData' in argon2HashConfigOptions &&
        (argon2HashConfigOptions.associatedData = Buffer.from(argon2HashConfigOptions.associatedData));
    return argon2_1.default.hash(stringToHash, argon2HashConfigOptions);
}
exports.generateHash = generateHash;
