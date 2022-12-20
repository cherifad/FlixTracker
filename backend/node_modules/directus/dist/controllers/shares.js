"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const use_collection_1 = __importDefault(require("../middleware/use-collection"));
const validate_batch_1 = require("../middleware/validate-batch");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const constants_1 = require("../constants");
const joi_1 = __importDefault(require("joi"));
const env_1 = __importDefault(require("../env"));
const router = express_1.default.Router();
router.use((0, use_collection_1.default)('directus_shares'));
const sharedLoginSchema = joi_1.default.object({
    share: joi_1.default.string().required(),
    password: joi_1.default.string(),
}).unknown();
router.post('/auth', (0, async_handler_1.default)(async (req, res, next) => {
    // This doesn't use accountability, as the user isn't logged in at this point
    const service = new services_1.SharesService({
        schema: req.schema,
    });
    const { error } = sharedLoginSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    const { accessToken, refreshToken, expires } = await service.login(req.body);
    res.cookie(env_1.default.REFRESH_TOKEN_COOKIE_NAME, refreshToken, constants_1.COOKIE_OPTIONS);
    res.locals.payload = { data: { access_token: accessToken, expires } };
    return next();
}), respond_1.respond);
const sharedInviteSchema = joi_1.default.object({
    share: joi_1.default.string().required(),
    emails: joi_1.default.array().items(joi_1.default.string()),
}).unknown();
router.post('/invite', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SharesService({
        schema: req.schema,
        accountability: req.accountability,
    });
    const { error } = sharedInviteSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    await service.invite(req.body);
    return next();
}), respond_1.respond);
router.post('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SharesService({
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
    const service = new services_1.SharesService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const records = await service.readByQuery(req.sanitizedQuery);
    res.locals.payload = { data: records || null };
    return next();
});
router.get('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.search('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.get(`/info/:pk(${constants_1.UUID_REGEX})`, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SharesService({
        schema: req.schema,
    });
    const record = await service.readOne(req.params.pk, {
        fields: ['id', 'collection', 'item', 'password', 'max_uses', 'times_used', 'date_start', 'date_end'],
        filter: {
            _and: [
                {
                    _or: [
                        {
                            date_start: {
                                _lte: new Date().toISOString(),
                            },
                        },
                        {
                            date_start: {
                                _null: true,
                            },
                        },
                    ],
                },
                {
                    _or: [
                        {
                            date_end: {
                                _gte: new Date().toISOString(),
                            },
                        },
                        {
                            date_end: {
                                _null: true,
                            },
                        },
                    ],
                },
            ],
        },
    });
    res.locals.payload = { data: record || null };
    return next();
}), respond_1.respond);
router.get(`/:pk(${constants_1.UUID_REGEX})`, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SharesService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const record = await service.readOne(req.params.pk, req.sanitizedQuery);
    res.locals.payload = { data: record || null };
    return next();
}), respond_1.respond);
router.patch('/', (0, validate_batch_1.validateBatch)('update'), (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SharesService({
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
router.patch(`/:pk(${constants_1.UUID_REGEX})`, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SharesService({
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
router.delete('/', (0, async_handler_1.default)(async (req, _res, next) => {
    const service = new services_1.SharesService({
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
router.delete(`/:pk(${constants_1.UUID_REGEX})`, (0, async_handler_1.default)(async (req, _res, next) => {
    const service = new services_1.SharesService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.deleteOne(req.params.pk);
    return next();
}), respond_1.respond);
exports.default = router;
