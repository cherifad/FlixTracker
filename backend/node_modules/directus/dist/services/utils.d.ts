import { Knex } from 'knex';
import { AbstractServiceOptions, PrimaryKey } from '../types';
import { Accountability, SchemaOverview } from '@directus/shared/types';
export declare class UtilsService {
    knex: Knex;
    accountability: Accountability | null;
    schema: SchemaOverview;
    constructor(options: AbstractServiceOptions);
    sort(collection: string, { item, to }: {
        item: PrimaryKey;
        to: PrimaryKey;
    }): Promise<void>;
}
