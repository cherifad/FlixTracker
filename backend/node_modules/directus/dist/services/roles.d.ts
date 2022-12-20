import { AbstractServiceOptions, MutationOptions, PrimaryKey } from '../types';
import { Query } from '@directus/shared/types';
import { ItemsService } from './items';
export declare class RolesService extends ItemsService {
    constructor(options: AbstractServiceOptions);
    private checkForOtherAdminRoles;
    private checkForOtherAdminUsers;
    updateOne(key: PrimaryKey, data: Record<string, any>, opts?: MutationOptions): Promise<PrimaryKey>;
    updateBatch(data: Record<string, any>[], opts?: MutationOptions): Promise<PrimaryKey[]>;
    updateMany(keys: PrimaryKey[], data: Record<string, any>, opts?: MutationOptions): Promise<PrimaryKey[]>;
    deleteOne(key: PrimaryKey): Promise<PrimaryKey>;
    deleteMany(keys: PrimaryKey[]): Promise<PrimaryKey[]>;
    deleteByQuery(query: Query, opts?: MutationOptions): Promise<PrimaryKey[]>;
}
