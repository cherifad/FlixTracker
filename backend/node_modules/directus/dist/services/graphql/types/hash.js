"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHash = void 0;
const graphql_1 = require("graphql");
exports.GraphQLHash = new graphql_1.GraphQLScalarType({
    ...graphql_1.GraphQLString,
    name: 'Hash',
    description: 'Hashed string values',
});
