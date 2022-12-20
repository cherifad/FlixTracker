import SchemaInspector from '@directus/schema';
import { Accountability, Field, RawField, SchemaOverview, Type } from '@directus/shared/types';
import Keyv from 'keyv';
import { Knex } from 'knex';
import { Column } from 'knex-schema-inspector/dist/types/column';
import { Helpers } from '../database/helpers';
import { ItemsService } from '../services/items';
import { PayloadService } from '../services/payload';
import { AbstractServiceOptions, MutationOptions } from '../types';
export declare class FieldsService {
    knex: Knex;
    helpers: Helpers;
    accountability: Accountability | null;
    itemsService: ItemsService;
    payloadService: PayloadService;
    schemaInspector: ReturnType<typeof SchemaInspector>;
    schema: SchemaOverview;
    cache: Keyv<any> | null;
    systemCache: Keyv<any>;
    constructor(options: AbstractServiceOptions);
    private get hasReadAccess();
    readAll(collection?: string): Promise<Field[]>;
    readOne(collection: string, field: string): Promise<Record<string, any>>;
    createField(collection: string, field: Partial<Field> & {
        field: string;
        type: Type | null;
    }, table?: Knex.CreateTableBuilder, // allows collection creation to
    opts?: MutationOptions): Promise<void>;
    updateField(collection: string, field: RawField, opts?: MutationOptions): Promise<string>;
    deleteField(collection: string, field: string, opts?: MutationOptions): Promise<void>;
    addColumnToTable(table: Knex.CreateTableBuilder, field: RawField | Field, alter?: Column | null): void;
}
