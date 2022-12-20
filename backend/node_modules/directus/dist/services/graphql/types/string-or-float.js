"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLStringOrFloat = void 0;
const graphql_1 = require("graphql");
/**
 * Adopted from https://kamranicus.com/handling-multiple-scalar-types-in-graphql/
 */
exports.GraphQLStringOrFloat = new graphql_1.GraphQLScalarType({
    name: 'GraphQLStringOrFloat',
    description: 'A Float or a String',
    serialize(value) {
        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new Error('Value must be either a String or a Float');
        }
        return value;
    },
    parseValue(value) {
        if (typeof value !== 'string' && typeof value !== 'number') {
            throw new Error('Value must be either a String or a Float');
        }
        return value;
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case graphql_1.Kind.INT:
            case graphql_1.Kind.FLOAT:
                return Number(ast.value);
            case graphql_1.Kind.STRING:
                return ast.value;
            default:
                throw new Error('Value must be either a String or a Float');
        }
    },
});
