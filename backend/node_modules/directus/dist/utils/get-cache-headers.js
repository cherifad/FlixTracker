"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheControlHeader = void 0;
const env_1 = __importDefault(require("../env"));
/**
 * Returns the Cache-Control header for the current request
 *
 * @param req Express request object
 * @param ttl TTL of the cache in ms
 */
function getCacheControlHeader(req, ttl) {
    var _a, _b, _c;
    // When the resource / current request isn't cached
    if (ttl === null)
        return 'no-cache';
    // When the API cache can invalidate at any moment
    if (env_1.default.CACHE_AUTO_PURGE === true)
        return 'no-cache';
    const noCacheRequested = ((_a = req.headers['cache-control']) === null || _a === void 0 ? void 0 : _a.includes('no-store')) || ((_b = req.headers['Cache-Control']) === null || _b === void 0 ? void 0 : _b.includes('no-store'));
    // When the user explicitly asked to skip the cache
    if (noCacheRequested)
        return 'no-store';
    // Cache control header uses seconds for everything
    const ttlSeconds = Math.round(ttl / 1000);
    const access = !!((_c = req.accountability) === null || _c === void 0 ? void 0 : _c.role) === false ? 'public' : 'private';
    let headerValue = `${access}, max-age=${ttlSeconds}`;
    // When the s-maxage flag should be included
    if (env_1.default.CACHE_CONTROL_S_MAXAGE !== false) {
        // Default to regular max-age flag when true
        if (env_1.default.CACHE_CONTROL_S_MAXAGE === true) {
            headerValue += `, s-maxage=${ttlSeconds}`;
        }
        else {
            // Set to custom value
            headerValue += `, s-maxage=${env_1.default.CACHE_CONTROL_S_MAXAGE}`;
        }
    }
    return headerValue;
}
exports.getCacheControlHeader = getCacheControlHeader;
