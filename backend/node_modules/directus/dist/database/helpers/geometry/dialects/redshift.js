"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryHelperRedshift = void 0;
const types_1 = require("../types");
class GeometryHelperRedshift extends types_1.GeometryHelper {
    createColumn(table, field) {
        if (field.type.split('.')[1]) {
            field.meta.special = [field.type];
        }
        return table.specificType(field.field, 'geometry');
    }
    asGeoJSON(table, column) {
        return this.knex.raw('st_asgeojson(??.??) as ??', [table, column, column]);
    }
}
exports.GeometryHelperRedshift = GeometryHelperRedshift;
