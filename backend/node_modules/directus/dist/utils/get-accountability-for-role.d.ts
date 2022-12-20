import { Accountability, SchemaOverview } from '@directus/shared/types';
import { Knex } from 'knex';
export declare function getAccountabilityForRole(role: null | string, context: {
    accountability: null | Accountability;
    schema: SchemaOverview;
    database: Knex;
}): Promise<Accountability>;
