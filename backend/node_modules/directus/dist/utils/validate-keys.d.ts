import { SchemaOverview } from '@directus/shared/types';
import { PrimaryKey } from '../types';
/**
 * Validate keys based on its type
 */
export declare function validateKeys(schema: SchemaOverview, collection: string, keyField: string, keys: PrimaryKey | PrimaryKey[]): void;
