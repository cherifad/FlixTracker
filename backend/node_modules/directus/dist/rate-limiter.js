"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const lodash_1 = require("lodash");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const env_1 = __importDefault(require("./env"));
const get_config_from_env_1 = require("./utils/get-config-from-env");
function createRateLimiter(configOverrides) {
    switch (env_1.default.RATE_LIMITER_STORE) {
        case 'redis':
            return new rate_limiter_flexible_1.RateLimiterRedis(getConfig('redis', configOverrides));
        case 'memcache':
            return new rate_limiter_flexible_1.RateLimiterMemcache(getConfig('memcache', configOverrides));
        case 'memory':
        default:
            return new rate_limiter_flexible_1.RateLimiterMemory(getConfig('memory', configOverrides));
    }
}
exports.createRateLimiter = createRateLimiter;
function getConfig(store = 'memory', overrides) {
    const config = (0, get_config_from_env_1.getConfigFromEnv)('RATE_LIMITER_', `RATE_LIMITER_${store}_`);
    if (store === 'redis') {
        const Redis = require('ioredis');
        delete config.redis;
        config.storeClient = new Redis(env_1.default.RATE_LIMITER_REDIS || (0, get_config_from_env_1.getConfigFromEnv)('RATE_LIMITER_REDIS_'));
    }
    if (store === 'memcache') {
        const Memcached = require('memcached');
        config.storeClient = new Memcached(env_1.default.RATE_LIMITER_MEMCACHE, (0, get_config_from_env_1.getConfigFromEnv)('RATE_LIMITER_MEMCACHE_'));
    }
    delete config.enabled;
    delete config.store;
    (0, lodash_1.merge)(config, overrides || {});
    return config;
}
