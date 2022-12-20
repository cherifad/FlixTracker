import { BaseException } from '@directus/shared/exceptions';
type Extensions = {
    collection: string;
    field: string | null;
    invalid?: string;
};
export declare class RecordNotUniqueException extends BaseException {
    constructor(field: string | null, extensions?: Extensions);
}
export {};
