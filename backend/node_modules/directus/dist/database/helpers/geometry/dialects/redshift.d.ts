import { GeometryHelper } from '../types';
import { Field, RawField } from '@directus/shared/types';
import { Knex } from 'knex';
export declare class GeometryHelperRedshift extends GeometryHelper {
    createColumn(table: Knex.CreateTableBuilder, field: RawField | Field): Knex.ColumnBuilder;
    asGeoJSON(table: string, column: string): Knex.Raw;
}
