"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationInfo = void 0;
const get_relation_type_1 = require("./get-relation-type");
function checkImplicitRelation(field) {
    if (field.startsWith('$FOLLOW(') && field.endsWith(')')) {
        return field.slice(8, -1).split(',');
    }
    return null;
}
function getRelationInfo(relations, collection, field) {
    var _a;
    if (field.startsWith('$FOLLOW') && field.length > 500) {
        throw new Error(`Implicit $FOLLOW statement is too big to parse. Got: "${field.substring(500)}..."`);
    }
    const implicitRelation = checkImplicitRelation(field);
    if (implicitRelation) {
        if (implicitRelation[2] === undefined) {
            const [m2oCollection, m2oField] = implicitRelation;
            const relation = {
                collection: m2oCollection.trim(),
                field: m2oField.trim(),
                related_collection: collection,
                schema: null,
                meta: null,
            };
            return { relation, relationType: 'o2m' };
        }
        else {
            const [a2oCollection, a2oItemField, a2oCollectionField] = implicitRelation;
            const relation = {
                collection: a2oCollection.trim(),
                field: a2oItemField.trim(),
                related_collection: collection,
                schema: null,
                meta: {
                    one_collection_field: a2oCollectionField.trim(),
                },
            };
            return { relation, relationType: 'o2a' };
        }
    }
    const relation = (_a = relations.find((relation) => {
        var _a;
        return ((relation.collection === collection && relation.field === field) ||
            (relation.related_collection === collection && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field) === field));
    })) !== null && _a !== void 0 ? _a : null;
    const relationType = relation ? (0, get_relation_type_1.getRelationType)({ relation, collection, field }) : null;
    return { relation, relationType };
}
exports.getRelationInfo = getRelationInfo;
