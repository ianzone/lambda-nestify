import { SchemaDefinition } from 'dynamoose/dist/Schema';

export type SchemaDef<T> = Record<keyof T, SchemaDefinition[keyof SchemaDefinition]>;

export * from './delay';
