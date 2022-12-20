import { SchemaHelper } from '../types';
export declare class SchemaHelperSQLite extends SchemaHelper {
    preColumnChange(): Promise<boolean>;
    postColumnChange(): Promise<void>;
}
