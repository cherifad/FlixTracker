import { GeometryHelper } from '../types';
import { Field, RawField } from '@directus/shared/types';
import { GeoJSONGeometry } from 'wellknown';
import { Knex } from 'knex';
export declare class GeometryHelperPostgres extends GeometryHelper {
    supported(): Promise<boolean>;
    createColumn(table: Knex.CreateTableBuilder, field: RawField | Field): Knex.ColumnBuilder;
    _intersects_bbox(key: string, geojson: GeoJSONGeometry): Knex.Raw;
    asGeoJSON(table: string, column: string): Knex.Raw;
}
