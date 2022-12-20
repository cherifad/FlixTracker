"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGraphQL = void 0;
const utils_1 = require("@directus/shared/utils");
const graphql_1 = require("graphql");
const exceptions_1 = require("../exceptions");
const async_handler_1 = __importDefault(require("../utils/async-handler"));
exports.parseGraphQL = (0, async_handler_1.default)(async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'POST') {
        throw new exceptions_1.MethodNotAllowedException('GraphQL only supports GET and POST requests.', { allow: ['GET', 'POST'] });
    }
    let query = null;
    let variables = null;
    let operationName = null;
    let document;
    if (req.method === 'GET') {
        query = req.query.query || null;
        if (req.query.variables) {
            try {
                variables = (0, utils_1.parseJSON)(req.query.variables);
            }
            catch {
                throw new exceptions_1.InvalidQueryException(`Variables are invalid JSON.`);
            }
        }
        else {
            variables = {};
        }
        operationName = req.query.operationName || null;
    }
    else {
        query = req.body.query || null;
        variables = req.body.variables || null;
        operationName = req.body.operationName || null;
    }
    if (query === null) {
        throw new exceptions_1.InvalidPayloadException('Must provide query string.');
    }
    try {
        document = (0, graphql_1.parse)(new graphql_1.Source(query));
    }
    catch (err) {
        throw new exceptions_1.InvalidPayloadException(`GraphQL schema validation error.`, {
            graphqlErrors: [err],
        });
    }
    const operationAST = (0, graphql_1.getOperationAST)(document, operationName);
    // You can only do `query` through GET
    if (req.method === 'GET' && (operationAST === null || operationAST === void 0 ? void 0 : operationAST.operation) !== 'query') {
        throw new exceptions_1.MethodNotAllowedException(`Can only perform a ${operationAST === null || operationAST === void 0 ? void 0 : operationAST.operation} from a POST request.`, {
            allow: ['POST'],
        });
    }
    // Prevent caching responses when mutations are made
    if ((operationAST === null || operationAST === void 0 ? void 0 : operationAST.operation) === 'mutation') {
        res.locals.cache = false;
    }
    res.locals.graphqlParams = { document, query, variables, operationName, contextValue: { req, res } };
    return next();
});
