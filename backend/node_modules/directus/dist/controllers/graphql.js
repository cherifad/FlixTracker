"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const graphql_1 = require("../middleware/graphql");
const respond_1 = require("../middleware/respond");
const services_1 = require("../services");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const router = (0, express_1.Router)();
router.use('/system', graphql_1.parseGraphQL, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.GraphQLService({
        accountability: req.accountability,
        schema: req.schema,
        scope: 'system',
    });
    res.locals.payload = await service.execute(res.locals.graphqlParams);
    return next();
}), respond_1.respond);
router.use('/', graphql_1.parseGraphQL, (0, async_handler_1.default)(async (req, res, next) => {
    const service = new services_1.GraphQLService({
        accountability: req.accountability,
        schema: req.schema,
        scope: 'items',
    });
    res.locals.payload = await service.execute(res.locals.graphqlParams);
    return next();
}), respond_1.respond);
exports.default = router;
