"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLDate = void 0;
const graphql_1 = require("graphql");
exports.GraphQLDate = new graphql_1.GraphQLScalarType({
    ...graphql_1.GraphQLString,
    name: 'Date',
    description: 'ISO8601 Date values',
});
