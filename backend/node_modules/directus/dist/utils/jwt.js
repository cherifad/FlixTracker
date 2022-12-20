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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessJWT = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const exceptions_1 = require("../exceptions");
function verifyAccessJWT(token, secret) {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, secret, {
            issuer: 'directus',
        });
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new exceptions_1.TokenExpiredException();
        }
        else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new exceptions_1.InvalidTokenException('Token invalid.');
        }
        else {
            throw new exceptions_1.ServiceUnavailableException(`Couldn't verify token.`, { service: 'jwt' });
        }
    }
    const { id, role, app_access, admin_access, share, share_scope } = payload;
    if (role === undefined || app_access === undefined || admin_access === undefined) {
        throw new exceptions_1.InvalidTokenException('Invalid token payload.');
    }
    return { id, role, app_access, admin_access, share, share_scope };
}
exports.verifyAccessJWT = verifyAccessJWT;
