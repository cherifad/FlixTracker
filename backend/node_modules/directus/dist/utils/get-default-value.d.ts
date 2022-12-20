import { SchemaOverview } from '@directus/schema/dist/types/overview';
import { Column } from 'knex-schema-inspector/dist/types/column';
export default function getDefaultValue(column: SchemaOverview[string]['columns'][string] | Column): string | boolean | number | Record<string, any> | any[] | null;
