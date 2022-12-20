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
const router = express_1.default.Router();
router.use((0, use_collection_1.default)('directus_settings'));
router.get('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SettingsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const records = await service.readSingleton(req.sanitizedQuery);
    res.locals.payload = { data: records || null };
    return next();
}), respond_1.respond);
router.patch('/', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SettingsService({
        accountability: req.accountability,
        schema: req.schema,
    });
    await service.upsertSingleton(req.body);
    try {
        const record = await service.readSingleton(req.sanitizedQuery);
        res.locals.payload = { data: record || null };
    }
    catch (error) {
        if (error instanceof exceptions_1.ForbiddenException) {
            return next();
        }
        throw error;
    }
    return next();
}), respond_1.respond);
exports.default = router;
