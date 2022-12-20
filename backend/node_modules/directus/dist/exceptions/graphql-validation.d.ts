import { BaseException } from '@directus/shared/exceptions';
export declare class GraphQLValidationException extends BaseException {
    constructor(extensions: Record<string, any>);
}
