"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountabilityForRole = void 0;
const get_permissions_1 = require("./get-permissions");
const exceptions_1 = require("../exceptions");
async function getAccountabilityForRole(role, context) {
    let generatedAccountability = context.accountability;
    if (role === null) {
        generatedAccountability = {
            role: null,
            user: null,
            admin: false,
            app: false,
        };
        generatedAccountability.permissions = await (0, get_permissions_1.getPermissions)(generatedAccountability, context.schema);
    }
    else if (role === 'system') {
        generatedAccountability = {
            user: null,
            role: null,
            admin: true,
            app: true,
            permissions: [],
        };
    }
    else {
        const roleInfo = await context.database
            .select(['app_access', 'admin_access'])
            .from('directus_roles')
            .where({ id: role })
            .first();
        if (!roleInfo) {
            throw new exceptions_1.InvalidConfigException(`Configured role "${role}" isn't a valid role ID or doesn't exist.`);
        }
        generatedAccountability = {
            role,
            user: null,
            admin: roleInfo.admin_access === 1 || roleInfo.admin_access === '1' || roleInfo.admin_access === true,
            app: roleInfo.app_access === 1 || roleInfo.app_access === '1' || roleInfo.app_access === true,
        };
        generatedAccountability.permissions = await (0, get_permissions_1.getPermissions)(generatedAccountability, context.schema);
    }
    return generatedAccountability;
}
exports.getAccountabilityForRole = getAccountabilityForRole;
