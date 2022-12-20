import { AuthDriver } from './auth/auth';
export declare function getAuthProvider(provider: string): AuthDriver;
export declare function registerAuthProviders(): Promise<void>;
