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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const qs_1 = __importDefault(require("qs"));
const helmet_1 = __importDefault(require("helmet"));
const activity_1 = __importDefault(require("./controllers/activity"));
const assets_1 = __importDefault(require("./controllers/assets"));
const auth_1 = __importDefault(require("./controllers/auth"));
const collections_1 = __importDefault(require("./controllers/collections"));
const dashboards_1 = __importDefault(require("./controllers/dashboards"));
const extensions_1 = __importDefault(require("./controllers/extensions"));
const fields_1 = __importDefault(require("./controllers/fields"));
const files_1 = __importDefault(require("./controllers/files"));
const flows_1 = __importDefault(require("./controllers/flows"));
const folders_1 = __importDefault(require("./controllers/folders"));
const graphql_1 = __importDefault(require("./controllers/graphql"));
const items_1 = __importDefault(require("./controllers/items"));
const not_found_1 = __importDefault(require("./controllers/not-found"));
const panels_1 = __importDefault(require("./controllers/panels"));
const notifications_1 = __importDefault(require("./controllers/notifications"));
const operations_1 = __importDefault(require("./controllers/operations"));
const permissions_1 = __importDefault(require("./controllers/permissions"));
const presets_1 = __importDefault(require("./controllers/presets"));
const relations_1 = __importDefault(require("./controllers/relations"));
const revisions_1 = __importDefault(require("./controllers/revisions"));
const roles_1 = __importDefault(require("./controllers/roles"));
const server_1 = __importDefault(require("./controllers/server"));
const settings_1 = __importDefault(require("./controllers/settings"));
const users_1 = __importDefault(require("./controllers/users"));
const utils_1 = __importDefault(require("./controllers/utils"));
const webhooks_1 = __importDefault(require("./controllers/webhooks"));
const shares_1 = __importDefault(require("./controllers/shares"));
const database_1 = require("./database");
const emitter_1 = __importDefault(require("./emitter"));
const env_1 = __importDefault(require("./env"));
const exceptions_1 = require("./exceptions");
const extensions_2 = require("./extensions");
const flows_2 = require("./flows");
const logger_1 = __importStar(require("./logger"));
const authenticate_1 = __importDefault(require("./middleware/authenticate"));
const get_permissions_1 = __importDefault(require("./middleware/get-permissions"));
const cache_1 = __importDefault(require("./middleware/cache"));
const check_ip_1 = require("./middleware/check-ip");
const cors_1 = __importDefault(require("./middleware/cors"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const extract_token_1 = __importDefault(require("./middleware/extract-token"));
const rate_limiter_1 = __importDefault(require("./middleware/rate-limiter"));
const sanitize_query_1 = __importDefault(require("./middleware/sanitize-query"));
const schema_1 = __importDefault(require("./middleware/schema"));
const constants_1 = require("./constants");
const track_1 = require("./utils/track");
const validate_env_1 = require("./utils/validate-env");
const validate_storage_1 = require("./utils/validate-storage");
const webhooks_2 = require("./webhooks");
const cache_2 = require("./cache");
const auth_2 = require("./auth");
const url_1 = require("./utils/url");
const get_config_from_env_1 = require("./utils/get-config-from-env");
const lodash_1 = require("lodash");
async function createApp() {
    (0, validate_env_1.validateEnv)(['KEY', 'SECRET']);
    if (!new url_1.Url(env_1.default.PUBLIC_URL).isAbsolute()) {
        logger_1.default.warn('PUBLIC_URL should be a full URL');
    }
    await (0, validate_storage_1.validateStorage)();
    await (0, database_1.validateDatabaseConnection)();
    await (0, database_1.validateDatabaseExtensions)();
    if ((await (0, database_1.isInstalled)()) === false) {
        logger_1.default.error(`Database doesn't have Directus tables installed.`);
        process.exit(1);
    }
    if ((await (0, database_1.validateMigrations)()) === false) {
        logger_1.default.warn(`Database migrations have not all been run`);
    }
    await (0, cache_2.flushCaches)();
    await (0, auth_2.registerAuthProviders)();
    const extensionManager = (0, extensions_2.getExtensionManager)();
    const flowManager = (0, flows_2.getFlowManager)();
    await extensionManager.initialize();
    await flowManager.initialize();
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.set('trust proxy', env_1.default.IP_TRUST_PROXY);
    app.set('query parser', (str) => qs_1.default.parse(str, { depth: 10 }));
    app.use(helmet_1.default.contentSecurityPolicy((0, lodash_1.merge)({
        useDefaults: true,
        directives: {
            // Unsafe-eval is required for vue3 / vue-i18n / app extensions
            scriptSrc: ["'self'", "'unsafe-eval'"],
            // Even though this is recommended to have enabled, it breaks most local
            // installations. Making this opt-in rather than opt-out is a little more
            // friendly. Ref #10806
            upgradeInsecureRequests: null,
            // These are required for MapLibre
            // https://cdn.directus.io is required for images/videos in the official docs
            workerSrc: ["'self'", 'blob:'],
            childSrc: ["'self'", 'blob:'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https://cdn.directus.io'],
            mediaSrc: ["'self'", 'https://cdn.directus.io'],
            connectSrc: ["'self'", 'https://*'],
        },
    }, (0, get_config_from_env_1.getConfigFromEnv)('CONTENT_SECURITY_POLICY_'))));
    if (env_1.default.HSTS_ENABLED) {
        app.use(helmet_1.default.hsts((0, get_config_from_env_1.getConfigFromEnv)('HSTS_', ['HSTS_ENABLED'])));
    }
    await emitter_1.default.emitInit('app.before', { app });
    await emitter_1.default.emitInit('middlewares.before', { app });
    app.use(logger_1.expressLogger);
    app.use((_req, res, next) => {
        res.setHeader('X-Powered-By', 'Directus');
        next();
    });
    if (env_1.default.CORS_ENABLED === true) {
        app.use(cors_1.default);
    }
    app.use((req, res, next) => {
        express_1.default.json({
            limit: env_1.default.MAX_PAYLOAD_SIZE,
        })(req, res, (err) => {
            if (err) {
                return next(new exceptions_1.InvalidPayloadException(err.message));
            }
            return next();
        });
    });
    app.use((0, cookie_parser_1.default)());
    app.use(extract_token_1.default);
    app.get('/', (_req, res, next) => {
        if (env_1.default.ROOT_REDIRECT) {
            res.redirect(env_1.default.ROOT_REDIRECT);
        }
        else {
            next();
        }
    });
    app.get('/robots.txt', (_, res) => {
        res.set('Content-Type', 'text/plain');
        res.status(200);
        res.send(constants_1.ROBOTSTXT);
    });
    if (env_1.default.SERVE_APP) {
        const adminPath = require.resolve('@directus/app');
        const adminUrl = new url_1.Url(env_1.default.PUBLIC_URL).addPath('admin');
        // Set the App's base path according to the APIs public URL
        const html = await fs_extra_1.default.readFile(adminPath, 'utf8');
        const htmlWithBase = html.replace(/<base \/>/, `<base href="${adminUrl.toString({ rootRelative: true })}/" />`);
        const sendHtml = (_req, res) => {
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Vary', 'Origin, Cache-Control');
            res.send(htmlWithBase);
        };
        const setStaticHeaders = (res) => {
            res.setHeader('Cache-Control', 'max-age=31536000, immutable');
            res.setHeader('Vary', 'Origin, Cache-Control');
        };
        app.get('/admin', sendHtml);
        app.use('/admin', express_1.default.static(path_1.default.join(adminPath, '..'), { setHeaders: setStaticHeaders }));
        app.use('/admin/*', sendHtml);
    }
    // use the rate limiter - all routes for now
    if (env_1.default.RATE_LIMITER_ENABLED === true) {
        app.use(rate_limiter_1.default);
    }
    app.get('/server/ping', (req, res) => res.send('pong'));
    app.use(authenticate_1.default);
    app.use(check_ip_1.checkIP);
    app.use(sanitize_query_1.default);
    app.use(cache_1.default);
    app.use(schema_1.default);
    app.use(get_permissions_1.default);
    await emitter_1.default.emitInit('middlewares.after', { app });
    await emitter_1.default.emitInit('routes.before', { app });
    app.use('/auth', auth_1.default);
    app.use('/graphql', graphql_1.default);
    app.use('/activity', activity_1.default);
    app.use('/assets', assets_1.default);
    app.use('/collections', collections_1.default);
    app.use('/dashboards', dashboards_1.default);
    app.use('/extensions', extensions_1.default);
    app.use('/fields', fields_1.default);
    app.use('/files', files_1.default);
    app.use('/flows', flows_1.default);
    app.use('/folders', folders_1.default);
    app.use('/items', items_1.default);
    app.use('/notifications', notifications_1.default);
    app.use('/operations', operations_1.default);
    app.use('/panels', panels_1.default);
    app.use('/permissions', permissions_1.default);
    app.use('/presets', presets_1.default);
    app.use('/relations', relations_1.default);
    app.use('/revisions', revisions_1.default);
    app.use('/roles', roles_1.default);
    app.use('/server', server_1.default);
    app.use('/settings', settings_1.default);
    app.use('/shares', shares_1.default);
    app.use('/users', users_1.default);
    app.use('/utils', utils_1.default);
    app.use('/webhooks', webhooks_1.default);
    // Register custom endpoints
    await emitter_1.default.emitInit('routes.custom.before', { app });
    app.use(extensionManager.getEndpointRouter());
    await emitter_1.default.emitInit('routes.custom.after', { app });
    app.use(not_found_1.default);
    app.use(error_handler_1.default);
    await emitter_1.default.emitInit('routes.after', { app });
    // Register all webhooks
    await (0, webhooks_2.init)();
    (0, track_1.track)('serverStarted');
    await emitter_1.default.emitInit('app.after', { app });
    return app;
}
exports.default = createApp;
