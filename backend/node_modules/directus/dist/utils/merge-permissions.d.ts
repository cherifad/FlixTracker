/// <reference types="lodash" />
import { Permission } from '@directus/shared/types';
export declare function mergePermissions(strategy: 'and' | 'or', ...permissions: Permission[][]): Permission[];
export declare function mergePermission(strategy: 'and' | 'or', currentPerm: Permission, newPerm: Permission): import("lodash").Omit<{
    permissions: import("@directus/shared/types").Filter | null;
    validation: import("@directus/shared/types").Filter | null;
    fields: string[] | null;
    presets: Record<string, any> | null;
    id?: number | undefined;
    role: string | null;
    collection: string;
    action: import("@directus/shared/types").PermissionsAction;
    system?: true | undefined;
}, "id" | "system">;
