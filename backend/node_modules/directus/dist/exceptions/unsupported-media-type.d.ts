import { BaseException } from '@directus/shared/exceptions';
export declare class UnsupportedMediaTypeException extends BaseException {
    constructor(message: string, extensions?: Record<string, unknown>);
}
