"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterForPath = exports.traverse = exports.mergePermissionsForShare = void 0;
const lodash_1 = require("lodash");
const merge_permissions_1 = require("./merge-permissions");
const app_access_permissions_1 = require("../database/system-data/app-access-permissions");
const reduce_schema_1 = require("./reduce-schema");
function mergePermissionsForShare(currentPermissions, accountability, schema) {
    const defaults = {
        action: 'read',
        role: accountability.role,
        collection: '',
        permissions: {},
        validation: null,
        presets: null,
        fields: null,
    };
    const { collection, item } = accountability.share_scope;
    const parentPrimaryKeyField = schema.collections[collection].primary;
    const reducedSchema = (0, reduce_schema_1.reduceSchema)(schema, currentPermissions, ['read']);
    const relationalPermissions = traverse(reducedSchema, parentPrimaryKeyField, item, collection);
    const parentCollectionPermission = (0, lodash_1.assign)({}, defaults, {
        collection,
        permissions: {
            [parentPrimaryKeyField]: {
                _eq: item,
            },
        },
    });
    // All permissions that will be merged into the original permissions set
    const allGeneratedPermissions = [
        parentCollectionPermission,
        ...relationalPermissions.map((generated) => (0, lodash_1.assign)({}, defaults, generated)),
        ...app_access_permissions_1.schemaPermissions,
    ];
    // All the collections that are touched through the relational tree from the current root collection, and the schema collections
    const allowedCollections = (0, lodash_1.uniq)(allGeneratedPermissions.map(({ collection }) => collection));
    const generatedPermissions = [];
    // Merge all the permissions that relate to the same collection with an _or (this allows you to properly retrieve)
    // the items of a collection if you entered that collection from multiple angles
    for (const collection of allowedCollections) {
        const permissionsForCollection = allGeneratedPermissions.filter((permission) => permission.collection === collection);
        if (permissionsForCollection.length > 0) {
            generatedPermissions.push(...(0, merge_permissions_1.mergePermissions)('or', permissionsForCollection));
        }
        else {
            generatedPermissions.push(...permissionsForCollection);
        }
    }
    // Explicitly filter out permissions to collections unrelated to the root parent item.
    const limitedPermissions = currentPermissions.filter(({ action, collection }) => allowedCollections.includes(collection) && action === 'read');
    return (0, merge_permissions_1.mergePermissions)('and', limitedPermissions, generatedPermissions);
}
exports.mergePermissionsForShare = mergePermissionsForShare;
function traverse(schema, rootItemPrimaryKeyField, rootItemPrimaryKey, currentCollection, parentCollections = [], path = []) {
    var _a, _b, _c;
    const permissions = [];
    // If there's already a permissions rule for the collection we're currently checking, we'll shortcircuit.
    // This prevents infinite loop in recursive relationships, like articles->related_articles->articles, or
    // articles.author->users.avatar->files.created_by->users.avatar->files.created_by->🔁
    if (parentCollections.includes(currentCollection)) {
        return permissions;
    }
    const relationsInCollection = schema.relations.filter((relation) => {
        return relation.collection === currentCollection || relation.related_collection === currentCollection;
    });
    for (const relation of relationsInCollection) {
        let type;
        if (relation.related_collection === currentCollection) {
            type = 'o2m';
        }
        else if (!relation.related_collection) {
            type = 'a2o';
        }
        else {
            type = 'm2o';
        }
        if (type === 'o2m') {
            permissions.push({
                collection: relation.collection,
                permissions: getFilterForPath(type, [...path, relation.field], rootItemPrimaryKeyField, rootItemPrimaryKey),
            });
            permissions.push(...traverse(schema, rootItemPrimaryKeyField, rootItemPrimaryKey, relation.collection, [...parentCollections, currentCollection], [...path, relation.field]));
        }
        if (type === 'a2o' && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_allowed_collections)) {
            for (const collection of relation.meta.one_allowed_collections) {
                permissions.push({
                    collection,
                    permissions: getFilterForPath(type, [...path, `$FOLLOW(${relation.collection},${relation.field},${relation.meta.one_collection_field})`], rootItemPrimaryKeyField, rootItemPrimaryKey),
                });
            }
        }
        if (type === 'm2o') {
            permissions.push({
                collection: relation.related_collection,
                permissions: getFilterForPath(type, [...path, `$FOLLOW(${relation.collection},${relation.field})`], rootItemPrimaryKeyField, rootItemPrimaryKey),
            });
            if ((_b = relation.meta) === null || _b === void 0 ? void 0 : _b.one_field) {
                permissions.push(...traverse(schema, rootItemPrimaryKeyField, rootItemPrimaryKey, relation.related_collection, [...parentCollections, currentCollection], [...path, (_c = relation.meta) === null || _c === void 0 ? void 0 : _c.one_field]));
            }
        }
    }
    return permissions;
}
exports.traverse = traverse;
function getFilterForPath(type, path, rootPrimaryKeyField, rootPrimaryKey) {
    const filter = {};
    if (type === 'm2o' || type === 'a2o') {
        (0, lodash_1.set)(filter, path.reverse(), { [rootPrimaryKeyField]: { _eq: rootPrimaryKey } });
    }
    else {
        (0, lodash_1.set)(filter, path.reverse(), { _eq: rootPrimaryKey });
    }
    return filter;
}
exports.getFilterForPath = getFilterForPath;
