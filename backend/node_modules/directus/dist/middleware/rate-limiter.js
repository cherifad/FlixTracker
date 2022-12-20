"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const ms_1 = __importDefault(require("ms"));
const env_1 = __importDefault(require("../env"));
const exceptions_1 = require("../exceptions");
const rate_limiter_1 = require("../rate-limiter");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const get_ip_from_req_1 = require("../utils/get-ip-from-req");
const validate_env_1 = require("../utils/validate-env");
let checkRateLimit = (req, res, next) => next();
if (env_1.default.RATE_LIMITER_ENABLED === true) {
    (0, validate_env_1.validateEnv)(['RATE_LIMITER_STORE', 'RATE_LIMITER_DURATION', 'RATE_LIMITER_POINTS']);
    exports.rateLimiter = (0, rate_limiter_1.createRateLimiter)();
    checkRateLimit = (0, async_handler_1.default)(async (req, res, next) => {
        try {
            await exports.rateLimiter.consume((0, get_ip_from_req_1.getIPFromReq)(req), 1);
        }
        catch (rateLimiterRes) {
            if (rateLimiterRes instanceof Error)
                throw rateLimiterRes;
            res.set('Retry-After', String(rateLimiterRes.msBeforeNext / 1000));
            throw new exceptions_1.HitRateLimitException(`Too many requests, retry after ${(0, ms_1.default)(rateLimiterRes.msBeforeNext)}.`, {
                limit: +env_1.default.RATE_LIMITER_POINTS,
                reset: new Date(Date.now() + rateLimiterRes.msBeforeNext),
            });
        }
        next();
    });
}
exports.default = checkRateLimit;
