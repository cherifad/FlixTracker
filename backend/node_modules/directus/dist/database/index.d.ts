import SchemaInspector from '@directus/schema';
import { Knex } from 'knex';
export default function getDatabase(): Knex;
export declare function getSchemaInspector(): ReturnType<typeof SchemaInspector>;
export declare function hasDatabaseConnection(database?: Knex): Promise<boolean>;
export declare function validateDatabaseConnection(database?: Knex): Promise<void>;
export declare function getDatabaseClient(database?: Knex): 'mysql' | 'postgres' | 'cockroachdb' | 'sqlite' | 'oracle' | 'mssql' | 'redshift';
export declare function isInstalled(): Promise<boolean>;
export declare function validateMigrations(): Promise<boolean>;
/**
 * These database extensions should be optional, so we don't throw or return any problem states when they don't
 */
export declare function validateDatabaseExtensions(): Promise<void>;
