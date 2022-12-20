/// <reference types="qs" />
import { RequestHandler } from 'express';
import { LoggerOptions } from 'pino';
declare const logger: import("pino").Logger<LoggerOptions & Record<string, any>>;
export declare const expressLogger: RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default logger;
