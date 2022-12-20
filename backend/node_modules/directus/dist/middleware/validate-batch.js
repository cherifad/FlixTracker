"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBatch = void 0;
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("@directus/shared/exceptions");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const sanitize_query_1 = require("../utils/sanitize-query");
const validateBatch = (scope) => (0, async_handler_1.default)(async (req, res, next) => {
    if (req.method.toLowerCase() === 'get') {
        req.body = {};
        return next();
    }
    if (req.method.toLowerCase() !== 'search' && scope !== 'read' && req.singleton) {
        return next();
    }
    if (!req.body)
        throw new exceptions_1.InvalidPayloadException('Payload in body is required');
    if (['update', 'delete'].includes(scope) && Array.isArray(req.body)) {
        return next();
    }
    // In reads, the query in the body should override the query params for searching
    if (scope === 'read' && req.body.query) {
        req.sanitizedQuery = (0, sanitize_query_1.sanitizeQuery)(req.body.query, req.accountability);
    }
    // Every cRUD action has either keys or query
    let batchSchema = joi_1.default.object().keys({
        keys: joi_1.default.array().items(joi_1.default.alternatives(joi_1.default.string(), joi_1.default.number())),
        query: joi_1.default.object().unknown(),
    });
    if (['update', 'delete'].includes(scope)) {
        batchSchema = batchSchema.xor('query', 'keys');
    }
    // In updates, we add a required `data` that holds the update payload if an array isn't used
    if (scope === 'update') {
        batchSchema = batchSchema.keys({
            data: joi_1.default.object().unknown().required(),
        });
    }
    const { error } = batchSchema.validate(req.body);
    if (error) {
        throw new exceptions_2.FailedValidationException(error.details[0]);
    }
    return next();
});
exports.validateBatch = validateBatch;
