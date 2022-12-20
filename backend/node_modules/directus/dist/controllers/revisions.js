"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const respond_1 = require("../middleware/respond");
const use_collection_1 = __importDefault(require("../middleware/use-collection"));
const validate_batch_1 = require("../middleware/validate-batch");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const router = express_1.default.Router();
router.use((0, use_collection_1.default)('directus_revisions'));
const readHandler = (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RevisionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const metaService = new services_1.MetaService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const records = await service.readByQuery(req.sanitizedQuery);
    const meta = await metaService.getMetaForQuery('directus_revisions', req.sanitizedQuery);
    res.locals.payload = { data: records || null, meta };
    return next();
});
router.get('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.search('/', (0, validate_batch_1.validateBatch)('read'), readHandler, respond_1.respond);
router.get('/:pk', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.RevisionsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const record = await service.readOne(req.params.pk, req.sanitizedQuery);
    res.locals.payload = { data: record || null };
    return next();
}), respond_1.respond);
exports.default = router;
