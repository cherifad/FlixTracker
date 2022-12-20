"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemFieldRows = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const format_title_1 = __importDefault(require("@directus/format-title"));
const get_auth_providers_1 = require("../../../utils/get-auth-providers");
const require_yaml_1 = require("../../../utils/require-yaml");
const defaults = (0, require_yaml_1.requireYAML)(require.resolve('./_defaults.yaml'));
const fieldData = fs_extra_1.default.readdirSync(path_1.default.resolve(__dirname));
exports.systemFieldRows = [];
for (const filepath of fieldData) {
    if (filepath.includes('_defaults') || filepath.includes('index'))
        continue;
    const systemFields = (0, require_yaml_1.requireYAML)(path_1.default.resolve(__dirname, filepath));
    systemFields.fields.forEach((field, index) => {
        const systemField = (0, lodash_1.merge)({ system: true }, defaults, field, {
            collection: systemFields.table,
            sort: index + 1,
        });
        // Dynamically populate auth providers field
        if (systemField.collection === 'directus_users' && systemField.field === 'provider') {
            (0, get_auth_providers_1.getAuthProviders)().forEach(({ name }) => {
                var _a, _b;
                (_b = (_a = systemField.options) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b.push({
                    text: (0, format_title_1.default)(name),
                    value: name,
                });
            });
        }
        exports.systemFieldRows.push(systemField);
    });
}
