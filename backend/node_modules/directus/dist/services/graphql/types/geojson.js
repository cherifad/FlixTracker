"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLGeoJSON = void 0;
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
exports.GraphQLGeoJSON = new graphql_1.GraphQLScalarType({
    ...graphql_compose_1.GraphQLJSON,
    name: 'GraphQLGeoJSON',
    description: 'GeoJSON value',
});
