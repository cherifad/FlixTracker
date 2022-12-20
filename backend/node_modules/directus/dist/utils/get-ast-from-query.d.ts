/**
 * Generate an AST based on a given collection and query
 */
import { Knex } from 'knex';
import { AST } from '../types';
import { Query, PermissionsAction, Accountability, SchemaOverview } from '@directus/shared/types';
type GetASTOptions = {
    accountability?: Accountability | null;
    action?: PermissionsAction;
    knex?: Knex;
};
export default function getASTFromQuery(collection: string, query: Query, schema: SchemaOverview, options?: GetASTOptions): Promise<AST>;
export {};
