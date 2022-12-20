"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaHelperSQLite = void 0;
const types_1 = require("../types");
class SchemaHelperSQLite extends types_1.SchemaHelper {
    async preColumnChange() {
        const foreignCheckStatus = (await this.knex.raw('PRAGMA foreign_keys'))[0].foreign_keys === 1;
        if (foreignCheckStatus) {
            await this.knex.raw('PRAGMA foreign_keys = OFF');
        }
        return foreignCheckStatus;
    }
    async postColumnChange() {
        await this.knex.raw('PRAGMA foreign_keys = ON');
    }
}
exports.SchemaHelperSQLite = SchemaHelperSQLite;
