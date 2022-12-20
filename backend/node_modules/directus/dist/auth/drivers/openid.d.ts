import { Router } from 'express';
import { Client } from 'openid-client';
import { UsersService } from '../../services';
import { AuthDriverOptions, User } from '../../types';
import { LocalAuthDriver } from './local';
export declare class OpenIDAuthDriver extends LocalAuthDriver {
    client: Promise<Client>;
    redirectUrl: string;
    usersService: UsersService;
    config: Record<string, any>;
    constructor(options: AuthDriverOptions, config: Record<string, any>);
    generateCodeVerifier(): string;
    generateAuthUrl(codeVerifier: string, prompt?: boolean): Promise<string>;
    private fetchUserId;
    getUserID(payload: Record<string, any>): Promise<string>;
    login(user: User): Promise<void>;
    refresh(user: User): Promise<void>;
}
export declare function createOpenIDAuthRouter(providerName: string): Router;
