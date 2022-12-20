"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemCollectionRows = void 0;
const lodash_1 = require("lodash");
const require_yaml_1 = require("../../../utils/require-yaml");
const systemData = (0, require_yaml_1.requireYAML)(require.resolve('./collections.yaml'));
exports.systemCollectionRows = systemData.data.map((row) => {
    return (0, lodash_1.merge)({ system: true }, systemData.defaults, row);
});
