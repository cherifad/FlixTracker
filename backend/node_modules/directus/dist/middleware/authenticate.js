"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lodash_1 = require("lodash");
const database_1 = __importDefault(require("../database"));
const emitter_1 = __importDefault(require("../emitter"));
const env_1 = __importDefault(require("../env"));
const exceptions_1 = require("../exceptions");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const get_ip_from_req_1 = require("../utils/get-ip-from-req");
const is_directus_jwt_1 = __importDefault(require("../utils/is-directus-jwt"));
const jwt_1 = require("../utils/jwt");
/**
 * Verify the passed JWT and assign the user ID and role to `req`
 */
const handler = async (req, res, next) => {
    const defaultAccountability = {
        user: null,
        role: null,
        admin: false,
        app: false,
        ip: (0, get_ip_from_req_1.getIPFromReq)(req),
        userAgent: req.get('user-agent'),
        origin: req.get('origin'),
    };
    const database = (0, database_1.default)();
    const customAccountability = await emitter_1.default.emitFilter('authenticate', defaultAccountability, {
        req,
    }, {
        database,
        schema: null,
        accountability: null,
    });
    if (customAccountability && (0, lodash_1.isEqual)(customAccountability, defaultAccountability) === false) {
        req.accountability = customAccountability;
        return next();
    }
    req.accountability = defaultAccountability;
    if (req.token) {
        if ((0, is_directus_jwt_1.default)(req.token)) {
            const payload = (0, jwt_1.verifyAccessJWT)(req.token, env_1.default.SECRET);
            req.accountability.share = payload.share;
            req.accountability.share_scope = payload.share_scope;
            req.accountability.user = payload.id;
            req.accountability.role = payload.role;
            req.accountability.admin = payload.admin_access === true || payload.admin_access == 1;
            req.accountability.app = payload.app_access === true || payload.app_access == 1;
        }
        else {
            // Try finding the user with the provided token
            const user = await database
                .select('directus_users.id', 'directus_users.role', 'directus_roles.admin_access', 'directus_roles.app_access')
                .from('directus_users')
                .leftJoin('directus_roles', 'directus_users.role', 'directus_roles.id')
                .where({
                'directus_users.token': req.token,
                status: 'active',
            })
                .first();
            if (!user) {
                throw new exceptions_1.InvalidCredentialsException();
            }
            req.accountability.user = user.id;
            req.accountability.role = user.role;
            req.accountability.admin = user.admin_access === true || user.admin_access == 1;
            req.accountability.app = user.app_access === true || user.app_access == 1;
        }
    }
    return next();
};
exports.handler = handler;
exports.default = (0, async_handler_1.default)(exports.handler);
