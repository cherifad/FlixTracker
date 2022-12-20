"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex('directus_fields')
        .update({ special: knex.raw(`REPLACE(??, 'geometry,', 'geometry.')`, ['special']) })
        .where('special', 'like', '%geometry,Point%')
        .orWhere('special', 'like', '%geometry,LineString%')
        .orWhere('special', 'like', '%geometry,Polygon%')
        .orWhere('special', 'like', '%geometry,MultiPoint%')
        .orWhere('special', 'like', '%geometry,MultiLineString%')
        .orWhere('special', 'like', '%geometry,MultiPolygon%');
}
exports.up = up;
async function down(knex) {
    await knex('directus_fields')
        .update({ special: knex.raw(`REPLACE(??, 'geometry.', 'geometry,')`, ['special']) })
        .where('special', 'like', '%geometry.Point%')
        .orWhere('special', 'like', '%geometry.LineString%')
        .orWhere('special', 'like', '%geometry.Polygon%')
        .orWhere('special', 'like', '%geometry.MultiPoint%')
        .orWhere('special', 'like', '%geometry.MultiLineString%')
        .orWhere('special', 'like', '%geometry.MultiPolygon%');
}
exports.down = down;
