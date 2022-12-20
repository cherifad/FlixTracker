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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.createServer = void 0;
const terminus_1 = require("@godaddy/terminus");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const lodash_1 = require("lodash");
const qs_1 = __importDefault(require("qs"));
const url_1 = __importDefault(require("url"));
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./database"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("./logger"));
const emitter_1 = __importDefault(require("./emitter"));
const update_check_1 = __importDefault(require("update-check"));
const package_json_1 = __importDefault(require("../package.json"));
const get_config_from_env_1 = require("./utils/get-config-from-env");
async function createServer() {
    const server = http.createServer(await (0, app_1.default)());
    Object.assign(server, (0, get_config_from_env_1.getConfigFromEnv)('SERVER_'));
    server.on('request', function (req, res) {
        const startTime = process.hrtime();
        const complete = (0, lodash_1.once)(function (finished) {
            var _a, _b, _c, _d;
            const elapsedTime = process.hrtime(startTime);
            const elapsedNanoseconds = elapsedTime[0] * 1e9 + elapsedTime[1];
            const elapsedMilliseconds = elapsedNanoseconds / 1e6;
            const previousIn = ((_a = req.socket._metrics) === null || _a === void 0 ? void 0 : _a.in) || 0;
            const previousOut = ((_b = req.socket._metrics) === null || _b === void 0 ? void 0 : _b.out) || 0;
            const metrics = {
                in: req.socket.bytesRead - previousIn,
                out: req.socket.bytesWritten - previousOut,
            };
            req.socket._metrics = {
                in: req.socket.bytesRead,
                out: req.socket.bytesWritten,
            };
            // Compatibility when supporting serving with certificates
            const protocol = server instanceof https.Server ? 'https' : 'http';
            // Rely on url.parse for path extraction
            // Doesn't break on illegal URLs
            const urlInfo = url_1.default.parse(req.originalUrl || req.url);
            const info = {
                finished,
                request: {
                    aborted: req.aborted,
                    completed: req.complete,
                    method: req.method,
                    url: urlInfo.href,
                    path: urlInfo.pathname,
                    protocol,
                    host: req.headers.host,
                    size: metrics.in,
                    query: urlInfo.query ? qs_1.default.parse(urlInfo.query) : {},
                    headers: req.headers,
                },
                response: {
                    status: res.statusCode,
                    size: metrics.out,
                    headers: res.getHeaders(),
                },
                ip: req.headers['x-forwarded-for'] || ((_c = req.socket) === null || _c === void 0 ? void 0 : _c.remoteAddress),
                duration: elapsedMilliseconds.toFixed(),
            };
            emitter_1.default.emitAction('response', info, {
                database: (0, database_1.default)(),
                schema: req.schema,
                accountability: (_d = req.accountability) !== null && _d !== void 0 ? _d : null,
            });
        });
        res.once('finish', complete.bind(null, true));
        res.once('close', complete.bind(null, false));
    });
    const terminusOptions = {
        timeout: 1000,
        signals: ['SIGINT', 'SIGTERM', 'SIGHUP'],
        beforeShutdown,
        onSignal,
        onShutdown,
    };
    (0, terminus_1.createTerminus)(server, terminusOptions);
    return server;
    async function beforeShutdown() {
        if (env_1.default.NODE_ENV !== 'development') {
            logger_1.default.info('Shutting down...');
        }
    }
    async function onSignal() {
        const database = (0, database_1.default)();
        await database.destroy();
        logger_1.default.info('Database connections destroyed');
    }
    async function onShutdown() {
        emitter_1.default.emitAction('server.stop', { server }, {
            database: (0, database_1.default)(),
            schema: null,
            accountability: null,
        });
        if (env_1.default.NODE_ENV !== 'development') {
            logger_1.default.info('Directus shut down OK. Bye bye!');
        }
    }
}
exports.createServer = createServer;
async function startServer() {
    const server = await createServer();
    const host = env_1.default.HOST;
    const port = env_1.default.PORT;
    server
        .listen(port, host, () => {
        (0, update_check_1.default)(package_json_1.default)
            .then((update) => {
            if (update) {
                logger_1.default.warn(`Update available: ${package_json_1.default.version} -> ${update.latest}`);
            }
        })
            .catch(() => {
            // No need to log/warn here. The update message is only an informative nice-to-have
        });
        logger_1.default.info(`Server started at http://${host}:${port}`);
        emitter_1.default.emitAction('server.start', { server }, {
            database: (0, database_1.default)(),
            schema: null,
            accountability: null,
        });
    })
        .once('error', (err) => {
        if ((err === null || err === void 0 ? void 0 : err.code) === 'EADDRINUSE') {
            logger_1.default.error(`Port ${port} is already in use`);
            process.exit(1);
        }
        else {
            throw err;
        }
    });
}
exports.startServer = startServer;
