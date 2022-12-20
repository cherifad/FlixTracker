"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLValidationException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class GraphQLValidationException extends exceptions_1.BaseException {
    constructor(extensions) {
        super('GraphQL validation error.', 400, 'GRAPHQL_VALIDATION_EXCEPTION', extensions);
    }
}
exports.GraphQLValidationException = GraphQLValidationException;
