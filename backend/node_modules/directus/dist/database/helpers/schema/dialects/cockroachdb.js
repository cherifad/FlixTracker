"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaHelperCockroachDb = void 0;
const types_1 = require("../types");
class SchemaHelperCockroachDb extends types_1.SchemaHelper {
    async changeToType(table, column, type, options = {}) {
        await this.changeToTypeByCopy(table, column, type, options);
    }
    constraintName(existingName) {
        const suffix = '_replaced';
        // CockroachDB does not allow for dropping/creating constraints with the same
        // name in a single transaction. reference issue #14873
        if (existingName.endsWith(suffix)) {
            return existingName.substring(0, existingName.length - suffix.length);
        }
        else {
            return existingName + suffix;
        }
    }
}
exports.SchemaHelperCockroachDb = SchemaHelperCockroachDb;
