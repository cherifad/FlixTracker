"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphQLType = void 0;
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
const date_1 = require("../services/graphql/types/date");
const geojson_1 = require("../services/graphql/types/geojson");
const hash_1 = require("../services/graphql/types/hash");
const bigint_1 = require("../services/graphql/types/bigint");
function getGraphQLType(localType, special) {
    if (special.includes('conceal')) {
        return hash_1.GraphQLHash;
    }
    switch (localType) {
        case 'boolean':
            return graphql_1.GraphQLBoolean;
        case 'bigInteger':
            return bigint_1.GraphQLBigInt;
        case 'integer':
            return graphql_1.GraphQLInt;
        case 'decimal':
        case 'float':
            return graphql_1.GraphQLFloat;
        case 'csv':
            return new graphql_1.GraphQLList(graphql_1.GraphQLString);
        case 'json':
            return graphql_compose_1.GraphQLJSON;
        case 'geometry':
            return geojson_1.GraphQLGeoJSON;
        case 'timestamp':
        case 'dateTime':
        case 'date':
            return date_1.GraphQLDate;
        case 'hash':
            return hash_1.GraphQLHash;
        default:
            return graphql_1.GraphQLString;
    }
}
exports.getGraphQLType = getGraphQLType;
