"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const env_1 = __importDefault(require("../env"));
const logger_1 = __importDefault(require("../logger"));
function validateEnv(requiredKeys) {
    for (const requiredKey of requiredKeys) {
        if (requiredKey in env_1.default === false) {
            logger_1.default.error(`"${requiredKey}" Environment Variable is missing.`);
            process.exit(1);
        }
    }
}
exports.validateEnv = validateEnv;
