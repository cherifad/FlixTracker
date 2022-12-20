import { AbstractServiceOptions, LoginResult, Item, PrimaryKey, MutationOptions } from '../types';
import { ItemsService } from './items';
import { AuthorizationService } from './authorization';
export declare class SharesService extends ItemsService {
    authorizationService: AuthorizationService;
    constructor(options: AbstractServiceOptions);
    createOne(data: Partial<Item>, opts?: MutationOptions): Promise<PrimaryKey>;
    login(payload: Record<string, any>): Promise<LoginResult>;
    /**
     * Send a link to the given share ID to the given email(s). Note: you can only send a link to a share
     * if you have read access to that particular share
     */
    invite(payload: {
        emails: string[];
        share: PrimaryKey;
    }): Promise<void>;
}
