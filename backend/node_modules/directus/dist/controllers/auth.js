"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = __importDefault(require("../env"));
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const get_auth_providers_1 = require("../utils/get-auth-providers");
const logger_1 = __importDefault(require("../logger"));
const drivers_1 = require("../auth/drivers");
const constants_1 = require("../constants");
const get_ip_from_req_1 = require("../utils/get-ip-from-req");
const constants_2 = require("../constants");
const router = (0, express_1.Router)();
const authProviders = (0, get_auth_providers_1.getAuthProviders)();
for (const authProvider of authProviders) {
    let authRouter;
    switch (authProvider.driver) {
        case 'local':
            authRouter = (0, drivers_1.createLocalAuthRouter)(authProvider.name);
            break;
        case 'oauth2':
            authRouter = (0, drivers_1.createOAuth2AuthRouter)(authProvider.name);
            break;
        case 'openid':
            authRouter = (0, drivers_1.createOpenIDAuthRouter)(authProvider.name);
            break;
        case 'ldap':
            authRouter = (0, drivers_1.createLDAPAuthRouter)(authProvider.name);
            break;
        case 'saml':
            authRouter = (0, drivers_1.createSAMLAuthRouter)(authProvider.name);
            break;
    }
    if (!authRouter) {
        logger_1.default.warn(`Couldn't create login router for auth provider "${authProvider.name}"`);
        continue;
    }
    router.use(`/login/${authProvider.name}`, authRouter);
}
if (!env_1.default.AUTH_DISABLE_DEFAULT) {
    router.use('/login', (0, drivers_1.createLocalAuthRouter)(constants_1.DEFAULT_AUTH_PROVIDER));
}
router.post('/refresh', (0, async_handler_1.default)(async (req, res, next) => {
    const accountability = {
        ip: (0, get_ip_from_req_1.getIPFromReq)(req),
        userAgent: req.get('user-agent'),
        origin: req.get('origin'),
        role: null,
    };
    const authenticationService = new services_1.AuthenticationService({
        accountability: accountability,
        schema: req.schema,
    });
    const currentRefreshToken = req.body.refresh_token || req.cookies[env_1.default.REFRESH_TOKEN_COOKIE_NAME];
    if (!currentRefreshToken) {
        throw new exceptions_1.InvalidPayloadException(`"refresh_token" is required in either the JSON payload or Cookie`);
    }
    const mode = req.body.mode || (req.body.refresh_token ? 'json' : 'cookie');
    const { accessToken, refreshToken, expires } = await authenticationService.refresh(currentRefreshToken);
    const payload = {
        data: { access_token: accessToken, expires },
    };
    if (mode === 'json') {
        payload.data.refresh_token = refreshToken;
    }
    if (mode === 'cookie') {
        res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, constants_2.COOKIE_OPTIONS);
    }
    res.locals.payload = payload;
    return next();
}), respond_1.respond);
router.post('/logout', (0, async_handler_1.default)(async (req, res, next) => {
    var _a;
    const accountability = {
        ip: (0, get_ip_from_req_1.getIPFromReq)(req),
        userAgent: req.get('user-agent'),
        origin: req.get('origin'),
        role: null,
    };
    const authenticationService = new services_1.AuthenticationService({
        accountability: accountability,
        schema: req.schema,
    });
    const currentRefreshToken = req.body.refresh_token || req.cookies[env_1.default.REFRESH_TOKEN_COOKIE_NAME];
    if (!currentRefreshToken) {
        throw new exceptions_1.InvalidPayloadException(`"refresh_token" is required in either the JSON payload or Cookie`);
    }
    await authenticationService.logout(currentRefreshToken);
    if (req.cookies[env_1.default.REFRESH_TOKEN_COOKIE_NAME]) {
        res.clearCookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            domain: env_1.default.REFRESH_TOKEN_COOKIE_DOMAIN,
            secure: (_a = env_1.default.REFRESH_TOKEN_COOKIE_SECURE) !== null && _a !== void 0 ? _a : false,
            sameSite: env_1.default.REFRESH_TOKEN_COOKIE_SAME_SITE || 'strict',
        });
    }
    return next();
}), respond_1.respond);
router.post('/password/request', (0, async_handler_1.default)(async (req, res, next) => {
    if (typeof req.body.email !== 'string') {
        throw new exceptions_1.InvalidPayloadException(`"email" field is required.`);
    }
    const accountability = {
        ip: (0, get_ip_from_req_1.getIPFromReq)(req),
        userAgent: req.get('user-agent'),
        origin: req.get('origin'),
        role: null,
    };
    const service = new services_1.UsersService({ accountability, schema: req.schema });
    try {
        await service.requestPasswordReset(req.body.email, req.body.reset_url || null);
        return next();
    }
    catch (err) {
        if (err instanceof exceptions_1.InvalidPayloadException) {
            throw err;
        }
        else {
            logger_1.default.warn(err, `[email] ${err}`);
            return next();
        }
    }
}), respond_1.respond);
router.post('/password/reset', (0, async_handler_1.default)(async (req, res, next) => {
    if (typeof req.body.token !== 'string') {
        throw new exceptions_1.InvalidPayloadException(`"token" field is required.`);
    }
    if (typeof req.body.password !== 'string') {
        throw new exceptions_1.InvalidPayloadException(`"password" field is required.`);
    }
    const accountability = {
        ip: (0, get_ip_from_req_1.getIPFromReq)(req),
        userAgent: req.get('user-agent'),
        origin: req.get('origin'),
        role: null,
    };
    const service = new services_1.UsersService({ accountability, schema: req.schema });
    await service.resetPassword(req.body.token, req.body.password);
    return next();
}), respond_1.respond);
router.get('/', (0, async_handler_1.default)(async (req, res, next) => {
    res.locals.payload = {
        data: (0, get_auth_providers_1.getAuthProviders)(),
        disableDefault: env_1.default.AUTH_DISABLE_DEFAULT,
    };
    return next();
}), respond_1.respond);
exports.default = router;
