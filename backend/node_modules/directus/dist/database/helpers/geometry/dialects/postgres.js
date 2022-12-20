"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryHelperPostgres = void 0;
const types_1 = require("../types");
class GeometryHelperPostgres extends types_1.GeometryHelper {
    async supported() {
        const res = await this.knex.select('oid').from('pg_proc').where({ proname: 'postgis_version' });
        return res.length > 0;
    }
    createColumn(table, field) {
        var _a;
        const type = (_a = field.type.split('.')[1]) !== null && _a !== void 0 ? _a : 'geometry';
        return table.specificType(field.field, `geometry(${type}, 4326)`);
    }
    _intersects_bbox(key, geojson) {
        const geometry = this.fromGeoJSON(geojson);
        return this.knex.raw('?? && ?', [key, geometry]);
    }
    asGeoJSON(table, column) {
        return this.knex.raw('st_asgeojson(??.??) as ??', [table, column, column]);
    }
}
exports.GeometryHelperPostgres = GeometryHelperPostgres;
