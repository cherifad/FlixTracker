"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryHelper = void 0;
const wellknown_1 = require("wellknown");
const types_1 = require("../types");
class GeometryHelper extends types_1.DatabaseHelper {
    supported() {
        return true;
    }
    isTrue(expression) {
        return expression;
    }
    isFalse(expression) {
        return expression.wrap('NOT ', '');
    }
    createColumn(table, field) {
        var _a;
        const type = (_a = field.type.split('.')[1]) !== null && _a !== void 0 ? _a : 'geometry';
        return table.specificType(field.field, type);
    }
    asText(table, column) {
        return this.knex.raw('st_astext(??.??) as ??', [table, column, column]);
    }
    fromText(text) {
        return this.knex.raw('st_geomfromtext(?, 4326)', text);
    }
    fromGeoJSON(geojson) {
        return this.fromText((0, wellknown_1.stringify)(geojson));
    }
    _intersects(key, geojson) {
        const geometry = this.fromGeoJSON(geojson);
        return this.knex.raw('st_intersects(??, ?)', [key, geometry]);
    }
    intersects(key, geojson) {
        return this.isTrue(this._intersects(key, geojson));
    }
    nintersects(key, geojson) {
        return this.isFalse(this._intersects(key, geojson));
    }
    _intersects_bbox(key, geojson) {
        const geometry = this.fromGeoJSON(geojson);
        return this.knex.raw('st_intersects(??, ?)', [key, geometry]);
    }
    intersects_bbox(key, geojson) {
        return this.isTrue(this._intersects_bbox(key, geojson));
    }
    nintersects_bbox(key, geojson) {
        return this.isFalse(this._intersects_bbox(key, geojson));
    }
    collect(table, column) {
        return this.knex.raw('st_astext(st_collect(??.??))', [table, column]);
    }
}
exports.GeometryHelper = GeometryHelper;
