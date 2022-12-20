"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("../env"));
let corsMiddleware = (req, res, next) => next();
if (env_1.default.CORS_ENABLED === true) {
    corsMiddleware = (0, cors_1.default)({
        origin: env_1.default.CORS_ORIGIN || true,
        methods: env_1.default.CORS_METHODS || 'GET,POST,PATCH,DELETE',
        allowedHeaders: env_1.default.CORS_ALLOWED_HEADERS,
        exposedHeaders: env_1.default.CORS_EXPOSED_HEADERS,
        credentials: env_1.default.CORS_CREDENTIALS || undefined,
        maxAge: env_1.default.CORS_MAX_AGE || undefined,
    });
}
exports.default = corsMiddleware;
