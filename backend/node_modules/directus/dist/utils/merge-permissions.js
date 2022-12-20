"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergePermission = exports.mergePermissions = void 0;
const lodash_1 = require("lodash");
function mergePermissions(strategy, ...permissions) {
    const allPermissions = (0, lodash_1.flatten)(permissions);
    const mergedPermissions = allPermissions
        .reduce((acc, val) => {
        const key = `${val.collection}__${val.action}__${val.role || '$PUBLIC'}`;
        const current = acc.get(key);
        acc.set(key, current ? mergePermission(strategy, current, val) : val);
        return acc;
    }, new Map())
        .values();
    return Array.from(mergedPermissions);
}
exports.mergePermissions = mergePermissions;
function mergePermission(strategy, currentPerm, newPerm) {
    const logicalKey = `_${strategy}`;
    let permissions = currentPerm.permissions;
    let validation = currentPerm.validation;
    let fields = currentPerm.fields;
    let presets = currentPerm.presets;
    if (newPerm.permissions) {
        if (currentPerm.permissions && Object.keys(currentPerm.permissions)[0] === logicalKey) {
            permissions = {
                [logicalKey]: [
                    ...currentPerm.permissions[logicalKey],
                    newPerm.permissions,
                ],
            };
        }
        else if (currentPerm.permissions) {
            // Empty {} supersedes other permissions in _OR merge
            if (strategy === 'or' && ((0, lodash_1.isEqual)(currentPerm.permissions, {}) || (0, lodash_1.isEqual)(newPerm.permissions, {}))) {
                permissions = {};
            }
            else {
                permissions = {
                    [logicalKey]: [currentPerm.permissions, newPerm.permissions],
                };
            }
        }
        else {
            permissions = {
                [logicalKey]: [newPerm.permissions],
            };
        }
    }
    if (newPerm.validation) {
        if (currentPerm.validation && Object.keys(currentPerm.validation)[0] === logicalKey) {
            validation = {
                [logicalKey]: [
                    ...currentPerm.validation[logicalKey],
                    newPerm.validation,
                ],
            };
        }
        else if (currentPerm.validation) {
            // Empty {} supersedes other validations in _OR merge
            if (strategy === 'or' && ((0, lodash_1.isEqual)(currentPerm.validation, {}) || (0, lodash_1.isEqual)(newPerm.validation, {}))) {
                validation = {};
            }
            else {
                validation = {
                    [logicalKey]: [currentPerm.validation, newPerm.validation],
                };
            }
        }
        else {
            validation = {
                [logicalKey]: [newPerm.validation],
            };
        }
    }
    if (newPerm.fields) {
        if (Array.isArray(currentPerm.fields) && strategy === 'or') {
            fields = [...new Set([...currentPerm.fields, ...newPerm.fields])];
        }
        else if (Array.isArray(currentPerm.fields) && strategy === 'and') {
            fields = (0, lodash_1.intersection)(currentPerm.fields, newPerm.fields);
        }
        else {
            fields = newPerm.fields;
        }
        if (fields.includes('*'))
            fields = ['*'];
    }
    if (newPerm.presets) {
        presets = (0, lodash_1.merge)({}, presets, newPerm.presets);
    }
    return (0, lodash_1.omit)({
        ...currentPerm,
        permissions,
        validation,
        fields,
        presets,
    }, ['id', 'system']);
}
exports.mergePermission = mergePermission;
