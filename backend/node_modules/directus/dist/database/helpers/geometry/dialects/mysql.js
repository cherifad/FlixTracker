"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryHelperMySQL = void 0;
const types_1 = require("../types");
class GeometryHelperMySQL extends types_1.GeometryHelper {
    collect(table, column) {
        return this.knex.raw(`concat('geometrycollection(', group_concat(? separator ', '), ')'`, this.asText(table, column));
    }
    fromText(text) {
        return this.knex.raw('st_geomfromtext(?)', text);
    }
    asGeoJSON(table, column) {
        return this.knex.raw('st_asgeojson(??.??) as ??', [table, column, column]);
    }
}
exports.GeometryHelperMySQL = GeometryHelperMySQL;
