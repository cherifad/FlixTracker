import { Knex } from 'knex';
import { AbstractServiceOptions } from '../types';
import { Accountability, Query, SchemaOverview } from '@directus/shared/types';
export declare class MetaService {
    knex: Knex;
    accountability: Accountability | null;
    schema: SchemaOverview;
    constructor(options: AbstractServiceOptions);
    getMetaForQuery(collection: string, query: any): Promise<Record<string, any> | undefined>;
    totalCount(collection: string): Promise<number>;
    filterCount(collection: string, query: Query): Promise<number>;
}
