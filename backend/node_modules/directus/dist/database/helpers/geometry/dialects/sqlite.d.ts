import { GeometryHelper } from '../types';
import { Knex } from 'knex';
export declare class GeometryHelperSQLite extends GeometryHelper {
    supported(): Promise<boolean>;
    asGeoJSON(table: string, column: string): Knex.Raw;
}
