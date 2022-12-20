import { UsersService } from '../../services';
import { AuthDriverOptions, User } from '../../types';
import { LocalAuthDriver } from './local';
export declare class SAMLAuthDriver extends LocalAuthDriver {
    idp: any;
    sp: any;
    usersService: UsersService;
    config: Record<string, any>;
    constructor(options: AuthDriverOptions, config: Record<string, any>);
    fetchUserID(identifier: string): Promise<any>;
    getUserID(payload: Record<string, any>): Promise<any>;
    login(_user: User): Promise<void>;
}
export declare function createSAMLAuthRouter(providerName: string): import("express-serve-static-core").Router;
