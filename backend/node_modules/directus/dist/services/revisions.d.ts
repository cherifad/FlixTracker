import { AbstractServiceOptions, PrimaryKey } from '../types';
import { ItemsService } from './index';
export declare class RevisionsService extends ItemsService {
    constructor(options: AbstractServiceOptions);
    revert(pk: PrimaryKey): Promise<void>;
}
