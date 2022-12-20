"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryHelperSQLite = void 0;
const types_1 = require("../types");
class GeometryHelperSQLite extends types_1.GeometryHelper {
    async supported() {
        const res = await this.knex.select('name').from('pragma_function_list').where({ name: 'spatialite_version' });
        return res.length > 0;
    }
    asGeoJSON(table, column) {
        return this.knex.raw('asgeojson(??.??) as ??', [table, column, column]);
    }
}
exports.GeometryHelperSQLite = GeometryHelperSQLite;
