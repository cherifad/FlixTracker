import { Snapshot } from '../types';
import { Knex } from 'knex';
import { SchemaOverview } from '@directus/shared/types';
export declare function getSnapshot(options?: {
    database?: Knex;
    schema?: SchemaOverview;
}): Promise<Snapshot>;
