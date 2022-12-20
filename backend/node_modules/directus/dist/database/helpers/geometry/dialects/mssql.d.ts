import { GeometryHelper } from '../types';
import { Field, RawField } from '@directus/shared/types';
import { GeoJSONGeometry } from 'wellknown';
import { Knex } from 'knex';
export declare class GeometryHelperMSSQL extends GeometryHelper {
    isTrue(expression: Knex.Raw): Knex.Raw<any>;
    isFalse(expression: Knex.Raw): Knex.Raw<any>;
    createColumn(table: Knex.CreateTableBuilder, field: RawField | Field): Knex.ColumnBuilder;
    asText(table: string, column: string): Knex.Raw;
    fromText(text: string): Knex.Raw;
    _intersects(key: string, geojson: GeoJSONGeometry): Knex.Raw;
    _intersects_bbox(key: string, geojson: GeoJSONGeometry): Knex.Raw;
    collect(table: string, column: string): Knex.Raw;
}
