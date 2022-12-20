"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Check if a given string conforms to the structure of a JWT
 * and whether it is issued by Directus.
 */
function isDirectusJWT(string) {
    try {
        const payload = jsonwebtoken_1.default.decode(string, { json: true });
        if ((payload === null || payload === void 0 ? void 0 : payload.iss) !== 'directus')
            return false;
        return true;
    }
    catch {
        return false;
    }
}
exports.default = isDirectusJWT;
