import { BaseException } from '@directus/shared/exceptions';
export declare class InvalidPayloadException extends BaseException {
    constructor(message: string, extensions?: Record<string, unknown>);
}
