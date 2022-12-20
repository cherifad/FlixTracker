/**
 * Extract access token from:
 *
 * Authorization: Bearer
 * access_token query parameter
 *
 * and store in req.token
 */
import { RequestHandler } from 'express';
declare const extractToken: RequestHandler;
export default extractToken;
