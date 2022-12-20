"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const express_1 = require("express");
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const router = (0, express_1.Router)();
router.get('/specs/oas', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.SpecificationService({
        accountability: req.accountability,
        schema: req.schema,
    });
    res.locals.payload = await service.oas.generate();
    return next();
}), respond_1.respond);
router.get('/specs/graphql/:scope?', (0, async_handler_1.default)(async (req, res) => {
    const service = new services_1.SpecificationService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const serverService = new services_1.ServerService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const scope = req.params.scope || 'items';
    if (['items', 'system'].includes(scope) === false)
        throw new exceptions_1.RouteNotFoundException(req.path);
    const info = await serverService.serverInfo();
    const result = await service.graphql.generate(scope);
    const filename = info.project.project_name + '_' + (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd') + '.graphql';
    res.attachment(filename);
    res.send(result);
}));
router.get('/info', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.ServerService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const data = await service.serverInfo();
    res.locals.payload = { data };
    return next();
}), respond_1.respond);
router.get('/health', (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.ServerService({
        accountability: req.accountability,
        schema: req.schema,
    });
    const data = await service.health();
    res.setHeader('Content-Type', 'application/health+json');
    if (data.status === 'error')
        res.status(503);
    res.locals.payload = data;
    res.locals.cache = false;
    return next();
}), respond_1.respond);
exports.default = router;
