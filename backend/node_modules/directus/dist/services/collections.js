"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsService = void 0;
const schema_1 = __importDefault(require("@directus/schema"));
const cache_1 = require("../cache");
const constants_1 = require("../constants");
const database_1 = __importStar(require("../database"));
const collections_1 = require("../database/system-data/collections");
const env_1 = __importDefault(require("../env"));
const exceptions_1 = require("../exceptions");
const fields_1 = require("../services/fields");
const items_1 = require("../services/items");
const utils_1 = require("@directus/shared/utils");
const helpers_1 = require("../database/helpers");
const lodash_1 = require("lodash");
const get_schema_1 = require("../utils/get-schema");
const emitter_1 = __importDefault(require("../emitter"));
class CollectionsService {
    constructor(options) {
        this.knex = options.knex || (0, database_1.default)();
        this.helpers = (0, helpers_1.getHelpers)(this.knex);
        this.accountability = options.accountability || null;
        this.schemaInspector = options.knex ? (0, schema_1.default)(options.knex) : (0, database_1.getSchemaInspector)();
        this.schema = options.schema;
        const { cache, systemCache } = (0, cache_1.getCache)();
        this.cache = cache;
        this.systemCache = systemCache;
    }
    /**
     * Create a single new collection
     */
    async createOne(payload, opts) {
        var _a, _b;
        if (this.accountability && this.accountability.admin !== true) {
            throw new exceptions_1.ForbiddenException();
        }
        if (!payload.collection)
            throw new exceptions_1.InvalidPayloadException(`"collection" is required`);
        if (payload.collection.startsWith('directus_')) {
            throw new exceptions_1.InvalidPayloadException(`Collections can't start with "directus_"`);
        }
        const nestedActionEvents = [];
        try {
            const existingCollections = [
                ...((_b = (_a = (await this.knex.select('collection').from('directus_collections'))) === null || _a === void 0 ? void 0 : _a.map(({ collection }) => collection)) !== null && _b !== void 0 ? _b : []),
                ...Object.keys(this.schema.collections),
            ];
            if (existingCollections.includes(payload.collection)) {
                throw new exceptions_1.InvalidPayloadException(`Collection "${payload.collection}" already exists.`);
            }
            // Create the collection/fields in a transaction so it'll be reverted in case of errors or
            // permission problems. This might not work reliably in MySQL, as it doesn't support DDL in
            // transactions.
            await this.knex.transaction(async (trx) => {
                if (payload.schema) {
                    // Directus heavily relies on the primary key of a collection, so we have to make sure that
                    // every collection that is created has a primary key. If no primary key field is created
                    // while making the collection, we default to an auto incremented id named `id`
                    if (!payload.fields)
                        payload.fields = [
                            {
                                field: 'id',
                                type: 'integer',
                                meta: {
                                    hidden: true,
                                    interface: 'numeric',
                                    readonly: true,
                                },
                                schema: {
                                    is_primary_key: true,
                                    has_auto_increment: true,
                                },
                            },
                        ];
                    // Ensure that every field meta has the field/collection fields filled correctly
                    payload.fields = payload.fields.map((field) => {
                        if (field.meta) {
                            field.meta = {
                                ...field.meta,
                                field: field.field,
                                collection: payload.collection,
                            };
                        }
                        // Add flag for specific database type overrides
                        const flagToAdd = this.helpers.date.fieldFlagForField(field.type);
                        if (flagToAdd) {
                            (0, utils_1.addFieldFlag)(field, flagToAdd);
                        }
                        return field;
                    });
                    const fieldsService = new fields_1.FieldsService({ knex: trx, schema: this.schema });
                    await trx.schema.createTable(payload.collection, (table) => {
                        for (const field of payload.fields) {
                            if (field.type && constants_1.ALIAS_TYPES.includes(field.type) === false) {
                                fieldsService.addColumnToTable(table, field);
                            }
                        }
                    });
                    const fieldItemsService = new items_1.ItemsService('directus_fields', {
                        knex: trx,
                        accountability: this.accountability,
                        schema: this.schema,
                    });
                    const fieldPayloads = payload.fields.filter((field) => field.meta).map((field) => field.meta);
                    await fieldItemsService.createMany(fieldPayloads, {
                        bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                    });
                }
                if (payload.meta) {
                    const collectionItemsService = new items_1.ItemsService('directus_collections', {
                        knex: trx,
                        accountability: this.accountability,
                        schema: this.schema,
                    });
                    await collectionItemsService.createOne({
                        ...payload.meta,
                        collection: payload.collection,
                    }, {
                        bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                    });
                }
                return payload.collection;
            });
            return payload.collection;
        }
        finally {
            if (this.cache && env_1.default.CACHE_AUTO_PURGE && (opts === null || opts === void 0 ? void 0 : opts.autoPurgeCache) !== false) {
                await this.cache.clear();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.autoPurgeSystemCache) !== false) {
                await (0, cache_1.clearSystemCache)();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.emitEvents) !== false && nestedActionEvents.length > 0) {
                const updatedSchema = await (0, get_schema_1.getSchema)();
                for (const nestedActionEvent of nestedActionEvents) {
                    nestedActionEvent.context.schema = updatedSchema;
                    emitter_1.default.emitAction(nestedActionEvent.event, nestedActionEvent.meta, nestedActionEvent.context);
                }
            }
        }
    }
    /**
     * Create multiple new collections
     */
    async createMany(payloads, opts) {
        const nestedActionEvents = [];
        try {
            const collections = await this.knex.transaction(async (trx) => {
                const service = new CollectionsService({
                    schema: this.schema,
                    accountability: this.accountability,
                    knex: trx,
                });
                const collectionNames = [];
                for (const payload of payloads) {
                    const name = await service.createOne(payload, {
                        autoPurgeCache: false,
                        autoPurgeSystemCache: false,
                        bypassEmitAction: (params) => nestedActionEvents.push(params),
                    });
                    collectionNames.push(name);
                }
                return collectionNames;
            });
            return collections;
        }
        finally {
            if (this.cache && env_1.default.CACHE_AUTO_PURGE && (opts === null || opts === void 0 ? void 0 : opts.autoPurgeCache) !== false) {
                await this.cache.clear();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.autoPurgeSystemCache) !== false) {
                await (0, cache_1.clearSystemCache)();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.emitEvents) !== false && nestedActionEvents.length > 0) {
                const updatedSchema = await (0, get_schema_1.getSchema)();
                for (const nestedActionEvent of nestedActionEvents) {
                    nestedActionEvent.context.schema = updatedSchema;
                    emitter_1.default.emitAction(nestedActionEvent.event, nestedActionEvent.meta, nestedActionEvent.context);
                }
            }
        }
    }
    /**
     * Read all collections. Currently doesn't support any query.
     */
    async readByQuery() {
        var _a;
        const collectionItemsService = new items_1.ItemsService('directus_collections', {
            knex: this.knex,
            schema: this.schema,
            accountability: this.accountability,
        });
        let tablesInDatabase = await this.schemaInspector.tableInfo();
        let meta = (await collectionItemsService.readByQuery({
            limit: -1,
        }));
        meta.push(...collections_1.systemCollectionRows);
        if (this.accountability && this.accountability.admin !== true) {
            const collectionsGroups = meta.reduce((meta, item) => ({
                ...meta,
                [item.collection]: item.group,
            }), {});
            let collectionsYouHavePermissionToRead = this.accountability
                .permissions.filter((permission) => {
                return permission.action === 'read';
            })
                .map(({ collection }) => collection);
            for (const collection of collectionsYouHavePermissionToRead) {
                const group = collectionsGroups[collection];
                if (group)
                    collectionsYouHavePermissionToRead.push(group);
                delete collectionsGroups[collection];
            }
            collectionsYouHavePermissionToRead = [...new Set([...collectionsYouHavePermissionToRead])];
            tablesInDatabase = tablesInDatabase.filter((table) => {
                return collectionsYouHavePermissionToRead.includes(table.name);
            });
            meta = meta.filter((collectionMeta) => {
                return collectionsYouHavePermissionToRead.includes(collectionMeta.collection);
            });
        }
        const collections = [];
        for (const collectionMeta of meta) {
            const collection = {
                collection: collectionMeta.collection,
                meta: collectionMeta,
                schema: (_a = tablesInDatabase.find((table) => table.name === collectionMeta.collection)) !== null && _a !== void 0 ? _a : null,
            };
            collections.push(collection);
        }
        for (const table of tablesInDatabase) {
            const exists = !!collections.find(({ collection }) => collection === table.name);
            if (!exists) {
                collections.push({
                    collection: table.name,
                    schema: table,
                    meta: null,
                });
            }
        }
        if (env_1.default.DB_EXCLUDE_TABLES) {
            return collections.filter((collection) => env_1.default.DB_EXCLUDE_TABLES.includes(collection.collection) === false);
        }
        return collections;
    }
    /**
     * Get a single collection by name
     */
    async readOne(collectionKey) {
        const result = await this.readMany([collectionKey]);
        if (result.length === 0)
            throw new exceptions_1.ForbiddenException();
        return result[0];
    }
    /**
     * Read many collections by name
     */
    async readMany(collectionKeys) {
        if (this.accountability && this.accountability.admin !== true) {
            const permissions = this.accountability.permissions.filter((permission) => {
                return permission.action === 'read' && collectionKeys.includes(permission.collection);
            });
            if (collectionKeys.length !== permissions.length) {
                const collectionsYouHavePermissionToRead = permissions.map(({ collection }) => collection);
                for (const collectionKey of collectionKeys) {
                    if (collectionsYouHavePermissionToRead.includes(collectionKey) === false) {
                        throw new exceptions_1.ForbiddenException();
                    }
                }
            }
        }
        const collections = await this.readByQuery();
        return collections.filter(({ collection }) => collectionKeys.includes(collection));
    }
    /**
     * Update a single collection by name
     */
    async updateOne(collectionKey, data, opts) {
        if (this.accountability && this.accountability.admin !== true) {
            throw new exceptions_1.ForbiddenException();
        }
        const nestedActionEvents = [];
        try {
            const collectionItemsService = new items_1.ItemsService('directus_collections', {
                knex: this.knex,
                accountability: this.accountability,
                schema: this.schema,
            });
            const payload = data;
            if (!payload.meta) {
                return collectionKey;
            }
            const exists = !!(await this.knex
                .select('collection')
                .from('directus_collections')
                .where({ collection: collectionKey })
                .first());
            if (exists) {
                await collectionItemsService.updateOne(collectionKey, payload.meta, {
                    ...opts,
                    bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                });
            }
            else {
                await collectionItemsService.createOne({ ...payload.meta, collection: collectionKey }, {
                    ...opts,
                    bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                });
            }
            return collectionKey;
        }
        finally {
            if (this.cache && env_1.default.CACHE_AUTO_PURGE && (opts === null || opts === void 0 ? void 0 : opts.autoPurgeCache) !== false) {
                await this.cache.clear();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.autoPurgeSystemCache) !== false) {
                await (0, cache_1.clearSystemCache)();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.emitEvents) !== false && nestedActionEvents.length > 0) {
                const updatedSchema = await (0, get_schema_1.getSchema)();
                for (const nestedActionEvent of nestedActionEvents) {
                    nestedActionEvent.context.schema = updatedSchema;
                    emitter_1.default.emitAction(nestedActionEvent.event, nestedActionEvent.meta, nestedActionEvent.context);
                }
            }
        }
    }
    /**
     * Update multiple collections in a single transaction
     */
    async updateBatch(data, opts) {
        if (this.accountability && this.accountability.admin !== true) {
            throw new exceptions_1.ForbiddenException();
        }
        if (!Array.isArray(data)) {
            throw new exceptions_1.InvalidPayloadException('Input should be an array of collection changes.');
        }
        const collectionKey = 'collection';
        const collectionKeys = [];
        const nestedActionEvents = [];
        try {
            await this.knex.transaction(async (trx) => {
                const collectionItemsService = new CollectionsService({
                    knex: trx,
                    accountability: this.accountability,
                    schema: this.schema,
                });
                for (const payload of data) {
                    if (!payload[collectionKey])
                        throw new exceptions_1.InvalidPayloadException(`Collection in update misses collection key.`);
                    await collectionItemsService.updateOne(payload[collectionKey], (0, lodash_1.omit)(payload, collectionKey), {
                        autoPurgeCache: false,
                        autoPurgeSystemCache: false,
                        bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                    });
                    collectionKeys.push(payload[collectionKey]);
                }
            });
        }
        finally {
            if (this.cache && env_1.default.CACHE_AUTO_PURGE && (opts === null || opts === void 0 ? void 0 : opts.autoPurgeCache) !== false) {
                await this.cache.clear();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.autoPurgeSystemCache) !== false) {
                await (0, cache_1.clearSystemCache)();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.emitEvents) !== false && nestedActionEvents.length > 0) {
                const updatedSchema = await (0, get_schema_1.getSchema)();
                for (const nestedActionEvent of nestedActionEvents) {
                    nestedActionEvent.context.schema = updatedSchema;
                    emitter_1.default.emitAction(nestedActionEvent.event, nestedActionEvent.meta, nestedActionEvent.context);
                }
            }
        }
        return collectionKeys;
    }
    /**
     * Update multiple collections by name
     */
    async updateMany(collectionKeys, data, opts) {
        if (this.accountability && this.accountability.admin !== true) {
            throw new exceptions_1.ForbiddenException();
        }
        const nestedActionEvents = [];
        try {
            await this.knex.transaction(async (trx) => {
                const service = new CollectionsService({
                    schema: this.schema,
                    accountability: this.accountability,
                    knex: trx,
                });
                for (const collectionKey of collectionKeys) {
                    await service.updateOne(collectionKey, data, {
                        autoPurgeCache: false,
                        autoPurgeSystemCache: false,
                        bypassEmitAction: (params) => nestedActionEvents.push(params),
                    });
                }
            });
            return collectionKeys;
        }
        finally {
            if (this.cache && env_1.default.CACHE_AUTO_PURGE && (opts === null || opts === void 0 ? void 0 : opts.autoPurgeCache) !== false) {
                await this.cache.clear();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.autoPurgeSystemCache) !== false) {
                await (0, cache_1.clearSystemCache)();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.emitEvents) !== false && nestedActionEvents.length > 0) {
                const updatedSchema = await (0, get_schema_1.getSchema)();
                for (const nestedActionEvent of nestedActionEvents) {
                    nestedActionEvent.context.schema = updatedSchema;
                    emitter_1.default.emitAction(nestedActionEvent.event, nestedActionEvent.meta, nestedActionEvent.context);
                }
            }
        }
    }
    /**
     * Delete a single collection This will delete the table and all records within. It'll also
     * delete any fields, presets, activity, revisions, and permissions relating to this collection
     */
    async deleteOne(collectionKey, opts) {
        if (this.accountability && this.accountability.admin !== true) {
            throw new exceptions_1.ForbiddenException();
        }
        const nestedActionEvents = [];
        try {
            const collections = await this.readByQuery();
            const collectionToBeDeleted = collections.find((collection) => collection.collection === collectionKey);
            if (!!collectionToBeDeleted === false) {
                throw new exceptions_1.ForbiddenException();
            }
            await this.knex.transaction(async (trx) => {
                var _a;
                if (collectionToBeDeleted.schema) {
                    await trx.schema.dropTable(collectionKey);
                }
                // Make sure this collection isn't used as a group in any other collections
                await trx('directus_collections').update({ group: null }).where({ group: collectionKey });
                if (collectionToBeDeleted.meta) {
                    const collectionItemsService = new items_1.ItemsService('directus_collections', {
                        knex: trx,
                        accountability: this.accountability,
                        schema: this.schema,
                    });
                    await collectionItemsService.deleteOne(collectionKey, {
                        bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                    });
                }
                if (collectionToBeDeleted.schema) {
                    const fieldsService = new fields_1.FieldsService({
                        knex: trx,
                        accountability: this.accountability,
                        schema: this.schema,
                    });
                    await trx('directus_fields').delete().where('collection', '=', collectionKey);
                    await trx('directus_presets').delete().where('collection', '=', collectionKey);
                    const revisionsToDelete = await trx
                        .select('id')
                        .from('directus_revisions')
                        .where({ collection: collectionKey });
                    if (revisionsToDelete.length > 0) {
                        const keys = revisionsToDelete.map((record) => record.id);
                        await trx('directus_revisions').update({ parent: null }).whereIn('parent', keys);
                    }
                    await trx('directus_revisions').delete().where('collection', '=', collectionKey);
                    await trx('directus_activity').delete().where('collection', '=', collectionKey);
                    await trx('directus_permissions').delete().where('collection', '=', collectionKey);
                    await trx('directus_relations').delete().where({ many_collection: collectionKey });
                    const relations = this.schema.relations.filter((relation) => {
                        return relation.collection === collectionKey || relation.related_collection === collectionKey;
                    });
                    for (const relation of relations) {
                        // Delete related o2m fields that point to current collection
                        if (relation.related_collection && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field)) {
                            await fieldsService.deleteField(relation.related_collection, relation.meta.one_field, {
                                autoPurgeCache: false,
                                autoPurgeSystemCache: false,
                                bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                            });
                        }
                        // Delete related m2o fields that point to current collection
                        if (relation.related_collection === collectionKey) {
                            await fieldsService.deleteField(relation.collection, relation.field, {
                                autoPurgeCache: false,
                                autoPurgeSystemCache: false,
                                bypassEmitAction: (params) => (opts === null || opts === void 0 ? void 0 : opts.bypassEmitAction) ? opts.bypassEmitAction(params) : nestedActionEvents.push(params),
                            });
                        }
                    }
                    const a2oRelationsThatIncludeThisCollection = this.schema.relations.filter((relation) => {
                        var _a, _b;
                        return (_b = (_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_allowed_collections) === null || _b === void 0 ? void 0 : _b.includes(collectionKey);
                    });
                    for (const relation of a2oRelationsThatIncludeThisCollection) {
                        const newAllowedCollections = relation
                            .meta.one_allowed_collections.filter((collection) => collectionKey !== collection)
                            .join(',');
                        await trx('directus_relations')
                            .update({ one_allowed_collections: newAllowedCollections })
                            .where({ id: relation.meta.id });
                    }
                }
            });
            return collectionKey;
        }
        finally {
            if (this.cache && env_1.default.CACHE_AUTO_PURGE && (opts === null || opts === void 0 ? void 0 : opts.autoPurgeCache) !== false) {
                await this.cache.clear();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.autoPurgeSystemCache) !== false) {
                await (0, cache_1.clearSystemCache)();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.emitEvents) !== false && nestedActionEvents.length > 0) {
                const updatedSchema = await (0, get_schema_1.getSchema)();
                for (const nestedActionEvent of nestedActionEvents) {
                    nestedActionEvent.context.schema = updatedSchema;
                    emitter_1.default.emitAction(nestedActionEvent.event, nestedActionEvent.meta, nestedActionEvent.context);
                }
            }
        }
    }
    /**
     * Delete multiple collections by key
     */
    async deleteMany(collectionKeys, opts) {
        if (this.accountability && this.accountability.admin !== true) {
            throw new exceptions_1.ForbiddenException();
        }
        const nestedActionEvents = [];
        try {
            await this.knex.transaction(async (trx) => {
                const service = new CollectionsService({
                    schema: this.schema,
                    accountability: this.accountability,
                    knex: trx,
                });
                for (const collectionKey of collectionKeys) {
                    await service.deleteOne(collectionKey, {
                        autoPurgeCache: false,
                        autoPurgeSystemCache: false,
                        bypassEmitAction: (params) => nestedActionEvents.push(params),
                    });
                }
            });
            return collectionKeys;
        }
        finally {
            if (this.cache && env_1.default.CACHE_AUTO_PURGE && (opts === null || opts === void 0 ? void 0 : opts.autoPurgeCache) !== false) {
                await this.cache.clear();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.autoPurgeSystemCache) !== false) {
                await (0, cache_1.clearSystemCache)();
            }
            if ((opts === null || opts === void 0 ? void 0 : opts.emitEvents) !== false && nestedActionEvents.length > 0) {
                const updatedSchema = await (0, get_schema_1.getSchema)();
                for (const nestedActionEvent of nestedActionEvents) {
                    nestedActionEvent.context.schema = updatedSchema;
                    emitter_1.default.emitAction(nestedActionEvent.event, nestedActionEvent.meta, nestedActionEvent.context);
                }
            }
        }
    }
}
exports.CollectionsService = CollectionsService;
