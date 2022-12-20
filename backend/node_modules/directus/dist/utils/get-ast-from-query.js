"use strict";
/**
 * Generate an AST based on a given collection and query
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const get_relation_type_1 = require("../utils/get-relation-type");
const constants_1 = require("@directus/shared/constants");
async function getASTFromQuery(collection, query, schema, options) {
    var _a, _b, _c, _d, _e;
    query = (0, lodash_1.cloneDeep)(query);
    const accountability = options === null || options === void 0 ? void 0 : options.accountability;
    const action = (options === null || options === void 0 ? void 0 : options.action) || 'read';
    const permissions = accountability && accountability.admin !== true
        ? (_b = (_a = accountability === null || accountability === void 0 ? void 0 : accountability.permissions) === null || _a === void 0 ? void 0 : _a.filter((permission) => {
            return permission.action === action;
        })) !== null && _b !== void 0 ? _b : []
        : null;
    const ast = {
        type: 'root',
        name: collection,
        query: query,
        children: [],
    };
    let fields = ['*'];
    if (query.fields) {
        fields = query.fields;
    }
    /**
     * When using aggregate functions, you can't have any other regular fields
     * selected. This makes sure you never end up in a non-aggregate fields selection error
     */
    if (Object.keys(query.aggregate || {}).length > 0) {
        fields = [];
    }
    /**
     * Similarly, when grouping on a specific field, you can't have other non-aggregated fields.
     * The group query will override the fields query
     */
    if (query.group) {
        fields = query.group;
    }
    fields = (0, lodash_1.uniq)(fields);
    const deep = query.deep || {};
    // Prevent fields/deep from showing up in the query object in further use
    delete query.fields;
    delete query.deep;
    if (!query.sort) {
        // We'll default to the primary key for the standard sort output
        let sortField = schema.collections[collection].primary;
        // If a custom manual sort field is configured, use that
        if ((_c = schema.collections[collection]) === null || _c === void 0 ? void 0 : _c.sortField) {
            sortField = schema.collections[collection].sortField;
        }
        // When group by is used, default to the first column provided in the group by clause
        if ((_d = query.group) === null || _d === void 0 ? void 0 : _d[0]) {
            sortField = query.group[0];
        }
        query.sort = [sortField];
    }
    // When no group by is supplied, but an aggregate function is used, only a single row will be
    // returned. In those cases, we'll ignore the sort field altogether
    if (query.aggregate && Object.keys(query.aggregate).length && !((_e = query.group) === null || _e === void 0 ? void 0 : _e[0])) {
        delete query.sort;
    }
    ast.children = await parseFields(collection, fields, deep);
    return ast;
    async function parseFields(parentCollection, fields, deep) {
        var _a, _b;
        if (!fields)
            return [];
        fields = await convertWildcards(parentCollection, fields);
        if (!fields || !Array.isArray(fields))
            return [];
        const children = [];
        const relationalStructure = Object.create(null);
        for (const fieldKey of fields) {
            let name = fieldKey;
            if (query.alias) {
                // check for field alias (is is one of the key)
                if (name in query.alias) {
                    name = query.alias[fieldKey];
                }
            }
            const isRelational = name.includes('.') ||
                // We'll always treat top level o2m fields as a related item. This is an alias field, otherwise it won't return
                // anything
                !!schema.relations.find((relation) => { var _a; return relation.related_collection === parentCollection && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field) === name; });
            if (isRelational) {
                // field is relational
                const parts = fieldKey.split('.');
                let rootField = parts[0];
                let collectionScope = null;
                // a2o related collection scoped field selector `fields=sections.section_id:headings.title`
                if (rootField.includes(':')) {
                    const [key, scope] = rootField.split(':');
                    rootField = key;
                    collectionScope = scope;
                }
                if (rootField in relationalStructure === false) {
                    if (collectionScope) {
                        relationalStructure[rootField] = { [collectionScope]: [] };
                    }
                    else {
                        relationalStructure[rootField] = [];
                    }
                }
                if (parts.length > 1) {
                    const childKey = parts.slice(1).join('.');
                    if (collectionScope) {
                        if (collectionScope in relationalStructure[rootField] === false) {
                            relationalStructure[rootField][collectionScope] = [];
                        }
                        relationalStructure[rootField][collectionScope].push(childKey);
                    }
                    else {
                        relationalStructure[rootField].push(childKey);
                    }
                }
            }
            else {
                if (fieldKey.includes('(') && fieldKey.includes(')')) {
                    const columnName = fieldKey.match(constants_1.REGEX_BETWEEN_PARENS)[1];
                    const foundField = schema.collections[parentCollection].fields[columnName];
                    if (foundField && foundField.type === 'alias') {
                        const foundRelation = schema.relations.find((relation) => { var _a; return relation.related_collection === parentCollection && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field) === columnName; });
                        if (foundRelation) {
                            children.push({
                                type: 'functionField',
                                name,
                                fieldKey,
                                query: {},
                                relatedCollection: foundRelation.collection,
                            });
                            continue;
                        }
                    }
                }
                children.push({ type: 'field', name, fieldKey });
            }
        }
        for (const [fieldKey, nestedFields] of Object.entries(relationalStructure)) {
            let fieldName = fieldKey;
            if (query.alias && fieldKey in query.alias) {
                fieldName = query.alias[fieldKey];
            }
            const relatedCollection = getRelatedCollection(parentCollection, fieldName);
            const relation = getRelation(parentCollection, fieldName);
            if (!relation)
                continue;
            const relationType = (0, get_relation_type_1.getRelationType)({
                relation,
                collection: parentCollection,
                field: fieldName,
            });
            if (!relationType)
                continue;
            let child = null;
            if (relationType === 'a2o') {
                const allowedCollections = relation.meta.one_allowed_collections.filter((collection) => {
                    if (!permissions)
                        return true;
                    return permissions.some((permission) => permission.collection === collection);
                });
                child = {
                    type: 'a2o',
                    names: allowedCollections,
                    children: {},
                    query: {},
                    relatedKey: {},
                    parentKey: schema.collections[parentCollection].primary,
                    fieldKey: fieldKey,
                    relation: relation,
                };
                for (const relatedCollection of allowedCollections) {
                    child.children[relatedCollection] = await parseFields(relatedCollection, Array.isArray(nestedFields) ? nestedFields : nestedFields[relatedCollection] || ['*'], deep === null || deep === void 0 ? void 0 : deep[`${fieldKey}:${relatedCollection}`]);
                    child.query[relatedCollection] = getDeepQuery((deep === null || deep === void 0 ? void 0 : deep[`${fieldKey}:${relatedCollection}`]) || {});
                    child.relatedKey[relatedCollection] = schema.collections[relatedCollection].primary;
                }
            }
            else if (relatedCollection) {
                if (permissions && permissions.some((permission) => permission.collection === relatedCollection) === false) {
                    continue;
                }
                // update query alias for children parseFields
                const deepAlias = (_a = getDeepQuery((deep === null || deep === void 0 ? void 0 : deep[fieldKey]) || {})) === null || _a === void 0 ? void 0 : _a.alias;
                if (!(0, lodash_1.isEmpty)(deepAlias))
                    query.alias = deepAlias;
                child = {
                    type: relationType,
                    name: relatedCollection,
                    fieldKey: fieldKey,
                    parentKey: schema.collections[parentCollection].primary,
                    relatedKey: schema.collections[relatedCollection].primary,
                    relation: relation,
                    query: getDeepQuery((deep === null || deep === void 0 ? void 0 : deep[fieldKey]) || {}),
                    children: await parseFields(relatedCollection, nestedFields, (deep === null || deep === void 0 ? void 0 : deep[fieldKey]) || {}),
                };
                if (relationType === 'o2m' && !child.query.sort) {
                    child.query.sort = [((_b = relation.meta) === null || _b === void 0 ? void 0 : _b.sort_field) || schema.collections[relation.collection].primary];
                }
            }
            if (child) {
                children.push(child);
            }
        }
        // Deduplicate any children fields that are included both as a regular field, and as a nested m2o field
        const nestedCollectionNodes = children.filter((childNode) => childNode.type !== 'field');
        return children.filter((childNode) => {
            const existsAsNestedRelational = !!nestedCollectionNodes.find((nestedCollectionNode) => childNode.fieldKey === nestedCollectionNode.fieldKey);
            if (childNode.type === 'field' && existsAsNestedRelational)
                return false;
            return true;
        });
    }
    async function convertWildcards(parentCollection, fields) {
        var _a, _b, _c;
        fields = (0, lodash_1.cloneDeep)(fields);
        const fieldsInCollection = Object.entries(schema.collections[parentCollection].fields).map(([name]) => name);
        let allowedFields = fieldsInCollection;
        if (permissions) {
            const permittedFields = (_a = permissions.find((permission) => parentCollection === permission.collection)) === null || _a === void 0 ? void 0 : _a.fields;
            if (permittedFields !== undefined)
                allowedFields = permittedFields;
        }
        if (!allowedFields || allowedFields.length === 0)
            return [];
        // In case of full read permissions
        if (allowedFields[0] === '*')
            allowedFields = fieldsInCollection;
        for (let index = 0; index < fields.length; index++) {
            const fieldKey = fields[index];
            if (fieldKey.includes('*') === false)
                continue;
            if (fieldKey === '*') {
                const aliases = Object.keys((_b = query.alias) !== null && _b !== void 0 ? _b : {});
                // Set to all fields in collection
                if (allowedFields.includes('*')) {
                    fields.splice(index, 1, ...fieldsInCollection, ...aliases);
                }
                else {
                    // Set to all allowed fields
                    const allowedAliases = aliases.filter((fieldKey) => {
                        const name = query.alias[fieldKey];
                        return allowedFields.includes(name);
                    });
                    fields.splice(index, 1, ...allowedFields, ...allowedAliases);
                }
            }
            // Swap *.* case for *,<relational-field>.*,<another-relational>.*
            if (fieldKey.includes('.') && fieldKey.split('.')[0] === '*') {
                const parts = fieldKey.split('.');
                const relationalFields = allowedFields.includes('*')
                    ? schema.relations
                        .filter((relation) => relation.collection === parentCollection || relation.related_collection === parentCollection)
                        .map((relation) => {
                        var _a;
                        const isMany = relation.collection === parentCollection;
                        return isMany ? relation.field : (_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field;
                    })
                    : allowedFields.filter((fieldKey) => !!getRelation(parentCollection, fieldKey));
                const nonRelationalFields = allowedFields.filter((fieldKey) => relationalFields.includes(fieldKey) === false);
                const aliasFields = Object.keys((_c = query.alias) !== null && _c !== void 0 ? _c : {}).map((fieldKey) => {
                    const name = query.alias[fieldKey];
                    if (relationalFields.includes(name)) {
                        return `${fieldKey}.${parts.slice(1).join('.')}`;
                    }
                    return fieldKey;
                });
                fields.splice(index, 1, ...[
                    ...relationalFields.map((relationalField) => {
                        return `${relationalField}.${parts.slice(1).join('.')}`;
                    }),
                    ...nonRelationalFields,
                    ...aliasFields,
                ]);
            }
        }
        return fields;
    }
    function getRelation(collection, field) {
        const relation = schema.relations.find((relation) => {
            var _a;
            return ((relation.collection === collection && relation.field === field) ||
                (relation.related_collection === collection && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field) === field));
        });
        return relation;
    }
    function getRelatedCollection(collection, field) {
        var _a;
        const relation = getRelation(collection, field);
        if (!relation)
            return null;
        if (relation.collection === collection && relation.field === field) {
            return relation.related_collection || null;
        }
        if (relation.related_collection === collection && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field) === field) {
            return relation.collection || null;
        }
        return null;
    }
}
exports.default = getASTFromQuery;
function getDeepQuery(query) {
    return (0, lodash_1.mapKeys)((0, lodash_1.omitBy)(query, (value, key) => key.startsWith('_') === false), (value, key) => key.substring(1));
}
