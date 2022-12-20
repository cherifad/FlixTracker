"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const use_collection_1 = __importDefault(require("../middleware/use-collection"));
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const collection_exists_1 = __importDefault(require("../middleware/collection-exists"));
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
router.use((0, use_collection_1.default)('directus_relations'));
router.get('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RelationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const relations = await service.readAll();
    res.locals.payload = { data: relations || null };
    return next();
}), respond_1.respond);
router.get('/:collection', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RelationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const relations = await service.readAll(req.params.collection);
    res.locals.payload = { data: relations || null };
    return next();
}), respond_1.respond);
router.get('/:collection/:field', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RelationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const relation = await service.readOne(req.params.collection, req.params.field);
    res.locals.payload = { data: relation || null };
    return next();
}), respond_1.respond);
const newRelationSchema = joi_1.default.object({
    collection: joi_1.default.string().required(),
    field: joi_1.default.string().required(),
    related_collection: joi_1.default.string().allow(null).optional(),
    schema: joi_1.default.object({
        on_delete: joi_1.default.string().valid('NO ACTION', 'SET NULL', 'SET DEFAULT', 'CASCADE', 'RESTRICT'),
    })
        .unknown()
        .allow(null),
    meta: joi_1.default.any(),
});
router.post('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RelationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const { error } = newRelationSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    await service.createOne(req.body);
    try {
        const createdRelation = await service.readOne(req.body.collection, req.body.field);
        res.locals.payload = { data: createdRelation || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
const updateRelationSchema = joi_1.default.object({
    collection: joi_1.default.string().optional(),
    field: joi_1.default.string().optional(),
    related_collection: joi_1.default.string().allow(null).optional(),
    schema: joi_1.default.object({
        on_delete: joi_1.default.string().valid('NO ACTION', 'SET NULL', 'SET DEFAULT', 'CASCADE', 'RESTRICT'),
    })
        .unknown()
        .allow(null),
    meta: joi_1.default.any(),
});
router.patch('/:collection/:field', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RelationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const { error } = updateRelationSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    await service.updateOne(req.params.collection, req.params.field, req.body);
    try {
        const updatedField = await service.readOne(req.params.collection, req.params.field);
        res.locals.payload = { data: updatedField || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.delete('/:collection/:field', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RelationsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.deleteOne(req.params.collection, req.params.field);
    return next();
}), respond_1.respond);
exports.default = router;
