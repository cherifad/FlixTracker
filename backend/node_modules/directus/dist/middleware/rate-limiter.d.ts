import { RequestHandler } from 'express';
import { RateLimiterMemcache, RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
declare let checkRateLimit: RequestHandler;
export declare let rateLimiter: RateLimiterRedis | RateLimiterMemcache | RateLimiterMemory;
export default checkRateLimit;
