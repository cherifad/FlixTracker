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
const router = express_1.default.Router();
router.use((0, use_collection_1.default)('directus_notifications'));
router.post('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.NotificationsService({
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
            const records = await service.readMany(savedKeys, req.sanitizedQuery);
            res.locals.payload = { data: records };
        }
        else {
            const record = await service.readOne(savedKeys[0], req.sanitizedQuery);
            res.locals.payload = { data: record };
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
    const service = new services_1.NotificationsService({
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
    const meta = await metaService.getMetaForQuery('directus_notifications', req.sanitizedQuery);
    res.locals.payload = { data: result, meta };
    return next();
});
router.get('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.search('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.get('/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.NotificationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const record = await service.readOne(req.params.pk, req.sanitizedQuery);
    res.locals.payload = { data: record || null };
    return next();
}), respond_1.respond);
router.patch('/', (0, validate_batch_1.validateBatch)('update'), (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.NotificationsService({
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
    const service = new services_1.NotificationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const primaryKey = await service.updateOne(req.params.pk, req.body);
    try {
        const record = await service.readOne(primaryKey, req.sanitizedQuery);
        res.locals.payload = { data: record };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.delete('/', (0, validate_batch_1.validateBatch)('delete'), (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.NotificationsService({
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
router.delete('/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.NotificationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.deleteOne(req.params.pk);
    return next();
}), respond_1.respond);
exports.default = router;
