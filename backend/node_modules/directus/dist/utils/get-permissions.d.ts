import { Accountability, Permission, SchemaOverview } from '@directus/shared/types';
export declare function getPermissions(accountability: Accountability, schema: SchemaOverview): Promise<Permission[]>;
