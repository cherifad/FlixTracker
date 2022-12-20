"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const use_collection_1 = __importDefault(require("../middleware/use-collection"));
const validate_batch_1 = require("../middleware/validate-batch");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const router = express_1.default.Router();
router.use((0, use_collection_1.default)('directus_users'));
router.post('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const savedKeys = [];
    if (Array.isArray(req.body)) {
        const keys = await service.createMany(req.body);
        savedKeys.push(...keys);
    }
    else {
        const key = await service.createOne(req.body);
        savedKeys.push(key);
    }
    try {
        if (Array.isArray(req.body)) {
            const items = await service.readMany(savedKeys, req.sanitizedQuery);
            res.locals.payload = { data: items };
        }
        else {
            const item = await service.readOne(savedKeys[0], req.sanitizedQuery);
            res.locals.payload = { data: item };
        }
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
const readHandler = (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const metaService = new services_1.MetaService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const item = await service.readByQuery(req.sanitizedQuery);
    const meta = await metaService.getMetaForQuery('directus_users', req.sanitizedQuery);
    res.locals.payload = { data: item || null, meta };
    return next();
});
router.get('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.search('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.get('/me', (0, async_handler_1.default)(async (req, res, next) => {
    var _a, _b, _c;
    if ((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.share_scope) {
        const user = {
            share: (_b = req.accountability) === null || _b === void 0 ? void 0 : _b.share,
            role: {
                id: req.accountability.role,
                admin_access: false,
                app_access: false,
            },
        };
        res.locals.payload = { data: user };
        return next();
    }
    if (!((_c = req.accountability) === null || _c === void 0 ? void 0 : _c.user)) {
        throw new exceptions_1.InvalidCredentialsException();
    }
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    try {
        const item = await service.readOne(req.accountability.user, req.sanitizedQuery);
        res.locals.payload = { data: item || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            res.locals.payload = { data: { id: req.accountability.user } };
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.get('/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    if (req.path.endsWith('me'))
        return next();
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const items = await service.readOne(req.params.pk, req.sanitizedQuery);
    res.locals.payload = { data: items || null };
    return next();
}), respond_1.respond);
router.patch('/me', (0, async_handler_1.default)(async (req, res, next) => {
    var _a;
    if (!((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user)) {
        throw new exceptions_1.InvalidCredentialsException();
    }
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const primaryKey = await service.updateOne(req.accountability.user, req.body);
    const item = await service.readOne(primaryKey, req.sanitizedQuery);
    res.locals.payload = { data: item || null };
    return next();
}), respond_1.respond);
router.patch('/me/track/page', (0, async_handler_1.default)(async (req, _res, next) => {
    var _a;
    if (!((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user)) {
        throw new exceptions_1.InvalidCredentialsException();
    }
    if (!req.body.last_page) {
        throw new exceptions_1.InvalidPayloadException(`"last_page" key is required.`);
    }
    const service = new services_1.UsersService({ schema: req.schema });
    await service.updateOne(req.accountability.user, { last_page: req.body.last_page });
    return next();
}), respond_1.respond);
router.patch('/', (0, validate_batch_1.validateBatch)('update'), (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    let keys = [];
    if (Array.isArray(req.body)) {
        keys = await service.updateBatch(req.body);
    }
    else if (req.body.keys) {
        keys = await service.updateMany(req.body.keys, req.body.data);
    }
    else {
        keys = await service.updateByQuery(req.body.query, req.body.data);
    }
    try {
        const result = await service.readMany(keys, req.sanitizedQuery);
        res.locals.payload = { data: result };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.patch('/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const primaryKey = await service.updateOne(req.params.pk, req.body);
    try {
        const item = await service.readOne(primaryKey, req.sanitizedQuery);
        res.locals.payload = { data: item || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.delete('/', (0, validate_batch_1.validateBatch)('delete'), (0, async_handler_1.default)(async (req, _res, next) => {
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    if (Array.isArray(req.body)) {
        await service.deleteMany(req.body);
    }
    else if (req.body.keys) {
        await service.deleteMany(req.body.keys);
    }
    else {
        await service.deleteByQuery(req.body.query);
    }
    return next();
}), respond_1.respond);
router.delete('/:pk', (0, async_handler_1.default)(async (req, _res, next) => {
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.deleteOne(req.params.pk);
    return next();
}), respond_1.respond);
const inviteSchema = joi_1.default.object({
    email: joi_1.default.alternatives(joi_1.default.string().email(), joi_1.default.array().items(joi_1.default.string().email())).required(),
    role: joi_1.default.string().uuid({ version: 'uuidv4' }).required(),
    invite_url: joi_1.default.string().uri(),
});
router.post('/invite', (0, async_handler_1.default)(async (req, _res, next) => {
    const { error } = inviteSchema.validate(req.body);
    if (error)
        throw new exceptions_1.InvalidPayloadException(error.message);
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.inviteUser(req.body.email, req.body.role, req.body.invite_url || null);
    return next();
}), respond_1.respond);
const acceptInviteSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
router.post('/invite/accept', (0, async_handler_1.default)(async (req, _res, next) => {
    const { error } = acceptInviteSchema.validate(req.body);
    if (error)
        throw new exceptions_1.InvalidPayloadException(error.message);
    const service = new services_1.UsersService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.acceptInvite(req.body.token, req.body.password);
    return next();
}), respond_1.respond);
router.post('/me/tfa/generate/', (0, async_handler_1.default)(async (req, res, next) => {
    var _a;
    if (!((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user)) {
        throw new exceptions_1.InvalidCredentialsException();
    }
    if (!req.body.password) {
        throw new exceptions_1.InvalidPayloadException(`"password" is required`);
    }
    const service = new services_1.TFAService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const authService = new services_1.AuthenticationService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await authService.verifyPassword(req.accountability.user, req.body.password);
    const { url, secret } = await service.generateTFA(req.accountability.user);
    res.locals.payload = { data: { secret, otpauth_url: url } };
    return next();
}), respond_1.respond);
router.post('/me/tfa/enable/', (0, async_handler_1.default)(async (req, _res, next) => {
    var _a, _b;
    if (!((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user)) {
        throw new exceptions_1.InvalidCredentialsException();
    }
    if (!req.body.secret) {
        throw new exceptions_1.InvalidPayloadException(`"secret" is required`);
    }
    if (!req.body.otp) {
        throw new exceptions_1.InvalidPayloadException(`"otp" is required`);
    }
    // Override permissions only when enforce TFA is enabled in role
    if (req.accountability.role) {
        const rolesService = new services_1.RolesService({
            schema: req.schema,
        });
        const role = (await rolesService.readOne(req.accountability.role));
        if (role && role.enforce_tfa) {
            const existingPermission = await ((_b = req.accountability.permissions) === null || _b === void 0 ? void 0 : _b.find((p) => p.collection === 'directus_users' && p.action === 'update'));
            if (existingPermission) {
                existingPermission.fields = ['tfa_secret'];
                existingPermission.permissions = { id: { _eq: req.accountability.user } };
                existingPermission.presets = null;
                existingPermission.validation = null;
            }
            else {
                (req.accountability.permissions || (req.accountability.permissions = [])).push({
                    action: 'update',
                    collection: 'directus_users',
                    fields: ['tfa_secret'],
                    permissions: { id: { _eq: req.accountability.user } },
                    presets: null,
                    role: req.accountability.role,
                    validation: null,
                });
            }
        }
    }
    const service = new services_1.TFAService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.enableTFA(req.accountability.user, req.body.otp, req.body.secret);
    return next();
}), respond_1.respond);
router.post('/me/tfa/disable', (0, async_handler_1.default)(async (req, _res, next) => {
    var _a, _b;
    if (!((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user)) {
        throw new exceptions_1.InvalidCredentialsException();
    }
    if (!req.body.otp) {
        throw new exceptions_1.InvalidPayloadException(`"otp" is required`);
    }
    // Override permissions only when enforce TFA is enabled in role
    if (req.accountability.role) {
        const rolesService = new services_1.RolesService({
            schema: req.schema,
        });
        const role = (await rolesService.readOne(req.accountability.role));
        if (role && role.enforce_tfa) {
            const existingPermission = await ((_b = req.accountability.permissions) === null || _b === void 0 ? void 0 : _b.find((p) => p.collection === 'directus_users' && p.action === 'update'));
            if (existingPermission) {
                existingPermission.fields = ['tfa_secret'];
                existingPermission.permissions = { id: { _eq: req.accountability.user } };
                existingPermission.presets = null;
                existingPermission.validation = null;
            }
            else {
                (req.accountability.permissions || (req.accountability.permissions = [])).push({
                    action: 'update',
                    collection: 'directus_users',
                    fields: ['tfa_secret'],
                    permissions: { id: { _eq: req.accountability.user } },
                    presets: null,
                    role: req.accountability.role,
                    validation: null,
                });
            }
        }
    }
    const service = new services_1.TFAService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const otpValid = await service.verifyOTP(req.accountability.user, req.body.otp);
    if (otpValid === false) {
        throw new exceptions_1.InvalidPayloadException(`"otp" is invalid`);
    }
    await service.disableTFA(req.accountability.user);
    return next();
}), respond_1.respond);
router.post('/:pk/tfa/disable', (0, async_handler_1.default)(async (req, _res, next) => {
    var _a;
    if (!((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user)) {
        throw new exceptions_1.InvalidCredentialsException();
    }
    if (!req.accountability.admin || !req.params.pk) {
        throw new exceptions_1.ForbiddenException();
    }
    const service = new services_1.TFAService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.disableTFA(req.params.pk);
    return next();
}), respond_1.respond);
exports.default = router;
