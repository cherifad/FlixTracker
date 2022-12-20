"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@directus/shared/types");
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const use_collection_1 = __importDefault(require("../middleware/use-collection"));
const validate_batch_1 = require("../middleware/validate-batch");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const get_ip_from_req_1 = require("../utils/get-ip-from-req");
const router = express_1.default.Router();
router.use((0, use_collection_1.default)('directus_activity'));
const readHandler = (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.ActivityService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const metaService = new services_1.MetaService({
        accountability: req.accountability,
        schema: req.schema,
    });
    let result;
    if (req.singleton) {
        result = await service.readSingleton(req.sanitizedQuery);
    }
    else if (req.body.keys) {
        result = await service.readMany(req.body.keys, req.sanitizedQuery);
    }
    else {
        result = await service.readByQuery(req.sanitizedQuery);
    }
    const meta = await metaService.getMetaForQuery('directus_activity', req.sanitizedQuery);
    res.locals.payload = {
        data: result,
        meta,
    };
    return next();
});
router.search('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.get('/', readHandler, respond_1.respond);
router.get('/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.ActivityService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const record = await service.readOne(req.params.pk, req.sanitizedQuery);
    res.locals.payload = {
        data: record || null,
    };
    return next();
}), respond_1.respond);
const createCommentSchema = joi_1.default.object({
    comment: joi_1.default.string().required(),
    collection: joi_1.default.string().required(),
    item: [joi_1.default.number().required(), joi_1.default.string().required()],
});
router.post('/comment', (0, async_handler_1.default)(async (req, res, next) => {
    var _a;
    const service = new services_1.ActivityService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const { error } = createCommentSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    const primaryKey = await service.createOne({
        ...req.body,
        action: types_1.Action.COMMENT,
        user: (_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user,
        ip: (0, get_ip_from_req_1.getIPFromReq)(req),
        user_agent: req.get('user-agent'),
        origin: req.get('origin'),
    });
    try {
        const record = await service.readOne(primaryKey, req.sanitizedQuery);
        res.locals.payload = {
            data: record || null,
        };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
const updateCommentSchema = joi_1.default.object({
    comment: joi_1.default.string().required(),
});
router.patch('/comment/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.ActivityService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const { error } = updateCommentSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    const primaryKey = await service.updateOne(req.params.pk, req.body);
    try {
        const record = await service.readOne(primaryKey, req.sanitizedQuery);
        res.locals.payload = {
            data: record || null,
        };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.delete('/comment/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.ActivityService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const adminService = new services_1.ActivityService({
        schema: req.schema,
    });
    const item = await adminService.readOne(req.params.pk, { fields: ['action'] });
    if (!item || item.action !== 'comment') {
        throw new exceptions_1.ForbiddenException();
    }
    await service.deleteOne(req.params.pk);
    return next();
}), respond_1.respond);
exports.default = router;
