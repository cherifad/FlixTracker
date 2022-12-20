import { BaseException } from '@directus/shared/exceptions';
export declare class InvalidConfigException extends BaseException {
    constructor(message?: string, extensions?: Record<string, any>);
}
