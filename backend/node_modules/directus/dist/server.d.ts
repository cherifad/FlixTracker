/// <reference types="node" />
import * as http from 'http';
export declare function createServer(): Promise<http.Server>;
export declare function startServer(): Promise<void>;
