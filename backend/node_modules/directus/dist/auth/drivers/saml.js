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
exports.createSAMLAuthRouter = exports.SAMLAuthDriver = void 0;
const validator = __importStar(require("@authenio/samlify-node-xmllint"));
const exceptions_1 = require("@directus/shared/exceptions");
const express_1 = __importStar(require("express"));
const samlify = __importStar(require("samlify"));
const auth_1 = require("../../auth");
const constants_1 = require("../../constants");
const env_1 = __importDefault(require("../../env"));
const exceptions_2 = require("../../exceptions");
const record_not_unique_1 = require("../../exceptions/database/record-not-unique");
const logger_1 = __importDefault(require("../../logger"));
const respond_1 = require("../../middleware/respond");
const services_1 = require("../../services");
const async_handler_1 = __importDefault(require("../../utils/async-handler"));
const get_config_from_env_1 = require("../../utils/get-config-from-env");
const local_1 = require("./local");
// tell samlify to use validator...
samlify.setSchemaValidator(validator);
class SAMLAuthDriver extends local_1.LocalAuthDriver {
    constructor(options, config) {
        super(options, config);
        this.config = config;
        this.usersService = new services_1.UsersService({ knex: this.knex, schema: this.schema });
        this.sp = samlify.ServiceProvider((0, get_config_from_env_1.getConfigFromEnv)(`AUTH_${config.provider.toUpperCase()}_SP`));
        this.idp = samlify.IdentityProvider((0, get_config_from_env_1.getConfigFromEnv)(`AUTH_${config.provider.toUpperCase()}_IDP`));
    }
    async fetchUserID(identifier) {
        const user = await this.knex
            .select('id')
            .from('directus_users')
            .whereRaw('LOWER(??) = ?', ['external_identifier', identifier.toLowerCase()])
            .first();
        return user === null || user === void 0 ? void 0 : user.id;
    }
    async getUserID(payload) {
        const { provider, emailKey, identifierKey, givenNameKey, familyNameKey, allowPublicRegistration } = this.config;
        const email = payload[emailKey !== null && emailKey !== void 0 ? emailKey : 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        const identifier = payload[identifierKey !== null && identifierKey !== void 0 ? identifierKey : 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const userID = await this.fetchUserID(identifier);
        if (userID)
            return userID;
        if (!allowPublicRegistration) {
            logger_1.default.trace(`[SAML] User doesn't exist, and public registration not allowed for provider "${provider}"`);
            throw new exceptions_2.InvalidCredentialsException();
        }
        const firstName = payload[givenNameKey !== null && givenNameKey !== void 0 ? givenNameKey : 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
        const lastName = payload[familyNameKey !== null && familyNameKey !== void 0 ? familyNameKey : 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
        try {
            return await this.usersService.createOne({
                provider,
                first_name: firstName,
                last_name: lastName,
                email: email,
                external_identifier: identifier.toLowerCase(),
                role: this.config.defaultRoleId,
            });
        }
        catch (error) {
            if (error instanceof record_not_unique_1.RecordNotUniqueException) {
                logger_1.default.warn(error, '[SAML] Failed to register user. User not unique');
                throw new exceptions_2.InvalidProviderException();
            }
            throw error;
        }
    }
    // There's no local checks to be done when the user is authenticated in the IDP
    async login(_user) {
        return;
    }
}
exports.SAMLAuthDriver = SAMLAuthDriver;
function createSAMLAuthRouter(providerName) {
    const router = (0, express_1.Router)();
    router.get('/metadata', (0, async_handler_1.default)(async (_req, res) => {
        const { sp } = (0, auth_1.getAuthProvider)(providerName);
        return res.header('Content-Type', 'text/xml').send(sp.getMetadata());
    }));
    router.get('/', (0, async_handler_1.default)(async (req, res) => {
        const { sp, idp } = (0, auth_1.getAuthProvider)(providerName);
        const { context: url } = await sp.createLoginRequest(idp, 'redirect');
        const parsedUrl = new URL(url);
        if (req.query.redirect) {
            parsedUrl.searchParams.append('RelayState', req.query.redirect);
        }
        return res.redirect(parsedUrl.toString());
    }));
    router.post('/logout', (0, async_handler_1.default)(async (req, res) => {
        const { sp, idp } = (0, auth_1.getAuthProvider)(providerName);
        const { context } = await sp.createLogoutRequest(idp, 'redirect', req.body);
        const authService = new services_1.AuthenticationService({ accountability: req.accountability, schema: req.schema });
        if (req.cookies[env_1.default.REFRESH_TOKEN_COOKIE_NAME]) {
            const currentRefreshToken = req.cookies[env_1.default.REFRESH_TOKEN_COOKIE_NAME];
            if (currentRefreshToken) {
                await authService.logout(currentRefreshToken);
                res.clearCookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, constants_1.COOKIE_OPTIONS);
            }
        }
        return res.redirect(context);
    }));
    router.post('/acs', express_1.default.urlencoded({ extended: false }), (0, async_handler_1.default)(async (req, res, next) => {
        var _a;
        const relayState = (_a = req.body) === null || _a === void 0 ? void 0 : _a.RelayState;
        try {
            const { sp, idp } = (0, auth_1.getAuthProvider)(providerName);
            const { extract } = await sp.parseLoginResponse(idp, 'post', req);
            const authService = new services_1.AuthenticationService({ accountability: req.accountability, schema: req.schema });
            const { accessToken, refreshToken, expires } = await authService.login(providerName, extract.attributes);
            res.locals.payload = {
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires,
                },
            };
            if (relayState) {
                res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, constants_1.COOKIE_OPTIONS);
                return res.redirect(relayState);
            }
            return next();
        }
        catch (error) {
            if (relayState) {
                let reason = 'UNKNOWN_EXCEPTION';
                if (error instanceof exceptions_1.BaseException) {
                    reason = error.code;
                }
                else {
                    logger_1.default.warn(error, `[SAML] Unexpected error during SAML login`);
                }
                return res.redirect(`${relayState.split('?')[0]}?reason=${reason}`);
            }
            logger_1.default.warn(error, `[SAML] Unexpected error during SAML login`);
            throw error;
        }
    }), respond_1.respond);
    return router;
}
exports.createSAMLAuthRouter = createSAMLAuthRouter;
