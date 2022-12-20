"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../constants");
const exceptions_1 = require("../exceptions");
const collection_exists_1 = __importDefault(require("../middleware/collection-exists"));
const respond_1 = require("../middleware/respond");
const use_collection_1 = __importDefault(require("../middleware/use-collection"));
const fields_1 = require("../services/fields");
const constants_2 = require("@directus/shared/constants");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const router = (0, express_1.Router)();
router.use((0, use_collection_1.default)('directus_fields'));
router.get('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new fields_1.FieldsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const fields = await service.readAll();
    res.locals.payload = { data: fields || null };
    return next();
}), respond_1.respond);
router.get('/:collection', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new fields_1.FieldsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const fields = await service.readAll(req.params.collection);
    res.locals.payload = { data: fields || null };
    return next();
}), respond_1.respond);
router.get('/:collection/:field', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new fields_1.FieldsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const field = await service.readOne(req.params.collection, req.params.field);
    res.locals.payload = { data: field || null };
    return next();
}), respond_1.respond);
const newFieldSchema = joi_1.default.object({
    collection: joi_1.default.string().optional(),
    field: joi_1.default.string().required(),
    type: joi_1.default.string()
        .valid(...constants_2.TYPES, ...constants_1.ALIAS_TYPES)
        .allow(null)
        .optional(),
    schema: joi_1.default.object({
        default_value: joi_1.default.any(),
        max_length: [joi_1.default.number(), joi_1.default.string(), joi_1.default.valid(null)],
        is_nullable: joi_1.default.bool(),
    })
        .unknown()
        .allow(null),
    meta: joi_1.default.any(),
});
router.post('/:collection', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new fields_1.FieldsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const { error } = newFieldSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    const field = req.body;
    await service.createField(req.params.collection, field);
    try {
        const createdField = await service.readOne(req.params.collection, field.field);
        res.locals.payload = { data: createdField || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
router.patch('/:collection', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new fields_1.FieldsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    if (Array.isArray(req.body) === false) {
        throw new exceptions_1.InvalidPayloadException('Submitted body has to be an array.');
    }
    for (const field of req.body) {
        await service.updateField(req.params.collection, field);
    }
    try {
        const results = [];
        for (const field of req.body) {
            const updatedField = await service.readOne(req.params.collection, field.field);
            results.push(updatedField);
            res.locals.payload = { data: results || null };
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
const updateSchema = joi_1.default.object({
    type: joi_1.default.string()
        .valid(...constants_2.TYPES, ...constants_1.ALIAS_TYPES)
        .allow(null),
    schema: joi_1.default.object({
        default_value: joi_1.default.any(),
        max_length: [joi_1.default.number(), joi_1.default.string(), joi_1.default.valid(null)],
        is_nullable: joi_1.default.bool(),
    })
        .unknown()
        .allow(null),
    meta: joi_1.default.any(),
}).unknown();
router.patch('/:collection/:field', collection_exists_1.default, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new fields_1.FieldsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const { error } = updateSchema.validate(req.body);
    if (error) {
        throw new exceptions_1.InvalidPayloadException(error.message);
    }
    if (req.body.schema && !req.body.type) {
        throw new exceptions_1.InvalidPayloadException(`You need to provide "type" when providing "schema".`);
    }
    const fieldData = req.body;
    if (!fieldData.field)
        fieldData.field = req.params.field;
    await service.updateField(req.params.collection, fieldData);
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
    const service = new fields_1.FieldsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.deleteField(req.params.collection, req.params.field);
    return next();
}), respond_1.respond);
exports.default = router;
