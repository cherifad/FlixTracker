import { Request } from 'express';
/**
 * Returns the Cache-Control header for the current request
 *
 * @param req Express request object
 * @param ttl TTL of the cache in ms
 */
export declare function getCacheControlHeader(req: Request, ttl: number | null): string;
