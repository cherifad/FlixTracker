"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLBigInt = void 0;
const graphql_1 = require("graphql");
exports.GraphQLBigInt = new graphql_1.GraphQLScalarType({
    name: 'GraphQLBigInt',
    description: 'BigInt value',
    serialize(value) {
        if (!value)
            return value;
        if (typeof value === 'string')
            return value;
        if (typeof value !== 'number') {
            throw new Error('Value must be a Number');
        }
        return value.toString();
    },
    parseValue(value) {
        if (typeof value !== 'string') {
            throw new Error('Value must be a String');
        }
        return parseNumberValue(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new Error('Value must be a String');
        }
        return parseNumberValue(ast.value);
    },
});
function parseNumberValue(input) {
    if (!/[+-]?([0-9]+[.])?[0-9]+/.test(input))
        return input;
    const value = parseInt(input);
    if (isNaN(value) || value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
        throw new Error('Invalid GraphQLBigInt');
    }
    return value;
}
