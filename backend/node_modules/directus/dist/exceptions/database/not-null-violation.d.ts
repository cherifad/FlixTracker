import { BaseException } from '@directus/shared/exceptions';
type Exceptions = {
    collection: string;
    field: string;
};
export declare class NotNullViolationException extends BaseException {
    constructor(field: string, exceptions?: Exceptions);
}
export {};
