"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exceptions_1 = require("../exceptions");
const collection_exists_1 = __importDefault(require("../middleware/collection-exists"));
const respond_1 = require("../middleware/respond");
const validate_batch_1 = require("../middleware/validate-batch");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const router = express_1.default.Router();
router.post('/:collection', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    if (req.params.collection.startsWith('directus_'))
        throw new exceptions_1.ForbiddenException();
    if (req.singleton) {
        throw new exceptions_1.RouteNotFoundException(req.path);
    }
    const service = new services_1.ItemsService(req.collection, {
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
            const result = await service.readMany(savedKeys, req.sanitizedQuery);
            res.locals.payload = { data: result || null };
        }
        else {
            const result = await service.readOne(savedKeys[0], req.sanitizedQuery);
            res.locals.payload = { data: result || null };
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
    if (req.params.collection.startsWith('directus_'))
        throw new exceptions_1.ForbiddenException();
    const service = new services_1.ItemsService(req.collection, {
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
    const meta = await metaService.getMetaForQuery(req.collection, req.sanitizedQuery);
    res.locals.payload = {
        meta: meta,
        data: result,
    };
    return next();
});
router.search('/:collection', collection_exists_1.default, (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.get('/:collection', collection_exists_1.default, readHandler, respond_1.respond);
router.get('/:collection/:pk', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    if (req.params.collection.startsWith('directus_'))
        throw new exceptions_1.ForbiddenException();
    const service = new services_1.ItemsService(req.collection, {
        accountability: req.accountability,
        schema: req.schema,
    });
    const result = await service.readOne(req.params.pk, req.sanitizedQuery);
    res.locals.payload = {
        data: result || null,
    };
    return next();
}), respond_1.respond);
router.patch('/:collection', collection_exists_1.default, (0, validate_batch_1.validateBatch)('update'), (0, async_handler_1.default)(async (req, res, next) => {
    if (req.params.collection.startsWith('directus_'))
        throw new exceptions_1.ForbiddenException();
    const service = new services_1.ItemsService(req.collection, {
        accountability: req.accountability,
        schema: req.schema,
    });
    if (req.singleton === true) {
        await service.upsertSingleton(req.body);
        const item = await service.readSingleton(req.sanitizedQuery);
        res.locals.payload = { data: item || null };
        return next();
    }
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
router.patch('/:collection/:pk', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    if (req.params.collection.startsWith('directus_'))
        throw new exceptions_1.ForbiddenException();
    if (req.singleton) {
        throw new exceptions_1.RouteNotFoundException(req.path);
    }
    const service = new services_1.ItemsService(req.collection, {
        accountability: req.accountability,
        schema: req.schema,
    });
    const updatedPrimaryKey = await service.updateOne(req.params.pk, req.body);
    try {
        const result = await service.readOne(updatedPrimaryKey, req.sanitizedQuery);
        res.locals.payload = { data: result || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.delete('/:collection', collection_exists_1.default, (0, validate_batch_1.validateBatch)('delete'), (0, async_handler_1.default)(async (req, res, next) => {
    if (req.params.collection.startsWith('directus_'))
        throw new exceptions_1.ForbiddenException();
    const service = new services_1.ItemsService(req.collection, {
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
router.delete('/:collection/:pk', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    if (req.params.collection.startsWith('directus_'))
        throw new exceptions_1.ForbiddenException();
    const service = new services_1.ItemsService(req.collection, {
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.deleteOne(req.params.pk);
    return next();
}), respond_1.respond);
exports.default = router;
