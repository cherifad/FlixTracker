import { BaseException } from '@directus/shared/exceptions';
export declare class RouteNotFoundException extends BaseException {
    constructor(path: string);
}
