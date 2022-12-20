"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appAccessMinimalPermissions = exports.schemaPermissions = void 0;
const lodash_1 = require("lodash");
const require_yaml_1 = require("../../../utils/require-yaml");
const defaults = {
    role: null,
    permissions: {},
    validation: null,
    presets: null,
    fields: ['*'],
    system: true,
};
const schemaPermissionsRaw = (0, require_yaml_1.requireYAML)(require.resolve('./schema-access-permissions.yaml'));
const permissions = (0, require_yaml_1.requireYAML)(require.resolve('./app-access-permissions.yaml'));
exports.schemaPermissions = schemaPermissionsRaw.map((row) => (0, lodash_1.merge)({}, defaults, row));
exports.appAccessMinimalPermissions = [...exports.schemaPermissions, ...permissions].map((row) => (0, lodash_1.merge)({}, defaults, row));
