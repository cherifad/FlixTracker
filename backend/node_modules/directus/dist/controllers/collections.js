"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const validate_batch_1 = require("../middleware/validate-batch");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const router = (0, express_1.Router)();
router.post('/', (0, async_handler_1.default)(async (req, res, next) => {
    const collectionsService = new services_1.CollectionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    if (Array.isArray(req.body)) {
        const collectionKey = await collectionsService.createMany(req.body);
        const records = await collectionsService.readMany(collectionKey);
        res.locals.payload = { data: records || null };
    }
    else {
        const collectionKey = await collectionsService.createOne(req.body);
        const record = await collectionsService.readOne(collectionKey);
        res.locals.payload = { data: record || null };
    }
    return next();
}), respond_1.respond);
const readHandler = (0, async_handler_1.default)(async (req, res, next) => {
    const collectionsService = new services_1.CollectionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const metaService = new services_1.MetaService({
        accountability: req.accountability,
        schema: req.schema,
    });
    let result = [];
    if (req.body.keys) {
        result = await collectionsService.readMany(req.body.keys);
    }
    else {
        result = await collectionsService.readByQuery();
    }
    const meta = await metaService.getMetaForQuery('directus_collections', {});
    res.locals.payload = { data: result, meta };
    return next();
});
router.get('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.search('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.get('/:collection', (0, async_handler_1.default)(async (req, res, next) => {
    const collectionsService = new services_1.CollectionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const collection = await collectionsService.readOne(req.params.collection);
    res.locals.payload = { data: collection || null };
    return next();
}), respond_1.respond);
router.patch('/', (0, async_handler_1.default)(async (req, res, next) => {
    const collectionsService = new services_1.CollectionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const collectionKeys = await collectionsService.updateBatch(req.body);
    try {
        const collections = await collectionsService.readMany(collectionKeys);
        res.locals.payload = { data: collections || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.patch('/:collection', (0, async_handler_1.default)(async (req, res, next) => {
    const collectionsService = new services_1.CollectionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await collectionsService.updateOne(req.params.collection, req.body);
    try {
        const collection = await collectionsService.readOne(req.params.collection);
        res.locals.payload = { data: collection || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.delete('/:collection', (0, async_handler_1.default)(async (req, res, next) => {
    const collectionsService = new services_1.CollectionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await collectionsService.deleteOne(req.params.collection);
    return next();
}), respond_1.respond);
exports.default = router;
