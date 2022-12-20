"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocalAuthRouter = exports.LocalAuthDriver = void 0;
const express_1 = require("express");
const argon2_1 = __importDefault(require("argon2"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../auth");
const exceptions_1 = require("../../exceptions");
const services_1 = require("../../services");
const async_handler_1 = __importDefault(require("../../utils/async-handler"));
const env_1 = __importDefault(require("../../env"));
const respond_1 = require("../../middleware/respond");
const constants_1 = require("../../constants");
const get_ip_from_req_1 = require("../../utils/get-ip-from-req");
const perf_hooks_1 = require("perf_hooks");
const stall_1 = require("../../utils/stall");
class LocalAuthDriver extends auth_1.AuthDriver {
    async getUserID(payload) {
        if (!payload.email) {
            throw new exceptions_1.InvalidCredentialsException();
        }
        const user = await this.knex
            .select('id')
            .from('directus_users')
            .whereRaw('LOWER(??) = ?', ['email', payload.email.toLowerCase()])
            .first();
        if (!user) {
            throw new exceptions_1.InvalidCredentialsException();
        }
        return user.id;
    }
    async verify(user, password) {
        if (!user.password || !(await argon2_1.default.verify(user.password, password))) {
            throw new exceptions_1.InvalidCredentialsException();
        }
    }
    async login(user, payload) {
        await this.verify(user, payload.password);
    }
}
exports.LocalAuthDriver = LocalAuthDriver;
function createLocalAuthRouter(provider) {
    const router = (0, express_1.Router)();
    const userLoginSchema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
        mode: joi_1.default.string().valid('cookie', 'json'),
        otp: joi_1.default.string(),
    }).unknown();
    router.post('/', (0, async_handler_1.default)(async (req, res, next) => {
        var _a;
        const STALL_TIME = env_1.default.LOGIN_STALL_TIME;
        const timeStart = perf_hooks_1.performance.now();
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
        const { error } = userLoginSchema.validate(req.body);
        if (error) {
            await (0, stall_1.stall)(STALL_TIME, timeStart);
            throw new exceptions_1.InvalidPayloadException(error.message);
        }
        const mode = req.body.mode || 'json';
        const { accessToken, refreshToken, expires } = await authenticationService.login(provider, req.body, (_a = req.body) === null || _a === void 0 ? void 0 : _a.otp);
        const payload = {
            data: { access_token: accessToken, expires },
        };
        if (mode === 'json') {
            payload.data.refresh_token = refreshToken;
        }
        if (mode === 'cookie') {
            res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, constants_1.COOKIE_OPTIONS);
        }
        res.locals.payload = payload;
        return next();
    }), respond_1.respond);
    return router;
}
exports.createLocalAuthRouter = createLocalAuthRouter;
