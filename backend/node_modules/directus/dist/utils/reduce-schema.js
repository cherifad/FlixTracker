"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceSchema = void 0;
const lodash_1 = require("lodash");
/**
 * Reduces the schema based on the included permissions. The resulting object is the schema structure, but with only
 * the allowed collections/fields/relations included based on the permissions.
 * @param schema The full project schema
 * @param actions Array of permissions actions (crud)
 * @returns Reduced schema
 */
function reduceSchema(schema, permissions, actions = ['create', 'read', 'update', 'delete']) {
    var _a, _b, _c;
    const reduced = {
        collections: {},
        relations: [],
    };
    const allowedFieldsInCollection = (_a = permissions === null || permissions === void 0 ? void 0 : permissions.filter((permission) => actions.includes(permission.action)).reduce((acc, permission) => {
        if (!acc[permission.collection]) {
            acc[permission.collection] = [];
        }
        if (permission.fields) {
            acc[permission.collection] = (0, lodash_1.uniq)([...acc[permission.collection], ...permission.fields]);
        }
        return acc;
    }, {})) !== null && _a !== void 0 ? _a : {};
    for (const [collectionName, collection] of Object.entries(schema.collections)) {
        if (!(permissions === null || permissions === void 0 ? void 0 : permissions.some((permission) => permission.collection === collectionName && actions.includes(permission.action)))) {
            continue;
        }
        const fields = {};
        for (const [fieldName, field] of Object.entries(schema.collections[collectionName].fields)) {
            if (!((_b = allowedFieldsInCollection[collectionName]) === null || _b === void 0 ? void 0 : _b.includes('*')) &&
                !((_c = allowedFieldsInCollection[collectionName]) === null || _c === void 0 ? void 0 : _c.includes(fieldName))) {
                continue;
            }
            const o2mRelation = schema.relations.find((relation) => { var _a; return relation.related_collection === collectionName && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field) === fieldName; });
            if (o2mRelation &&
                !(permissions === null || permissions === void 0 ? void 0 : permissions.some((permission) => permission.collection === o2mRelation.collection && actions.includes(permission.action)))) {
                continue;
            }
            fields[fieldName] = field;
        }
        reduced.collections[collectionName] = {
            ...collection,
            fields,
        };
    }
    reduced.relations = schema.relations.filter((relation) => {
        var _a, _b, _c;
        let collectionsAllowed = true;
        let fieldsAllowed = true;
        if (Object.keys(allowedFieldsInCollection).includes(relation.collection) === false) {
            collectionsAllowed = false;
        }
        if (relation.related_collection &&
            (Object.keys(allowedFieldsInCollection).includes(relation.related_collection) === false ||
                // Ignore legacy permissions with an empty fields array
                allowedFieldsInCollection[relation.related_collection].length === 0)) {
            collectionsAllowed = false;
        }
        if (((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_allowed_collections) &&
            relation.meta.one_allowed_collections.every((collection) => Object.keys(allowedFieldsInCollection).includes(collection)) === false) {
            collectionsAllowed = false;
        }
        if (!allowedFieldsInCollection[relation.collection] ||
            (allowedFieldsInCollection[relation.collection].includes('*') === false &&
                allowedFieldsInCollection[relation.collection].includes(relation.field) === false)) {
            fieldsAllowed = false;
        }
        if (relation.related_collection &&
            ((_b = relation.meta) === null || _b === void 0 ? void 0 : _b.one_field) &&
            (!allowedFieldsInCollection[relation.related_collection] ||
                (allowedFieldsInCollection[relation.related_collection].includes('*') === false &&
                    allowedFieldsInCollection[relation.related_collection].includes((_c = relation.meta) === null || _c === void 0 ? void 0 : _c.one_field) === false))) {
            fieldsAllowed = false;
        }
        return collectionsAllowed && fieldsAllowed;
    });
    return reduced;
}
exports.reduceSchema = reduceSchema;
