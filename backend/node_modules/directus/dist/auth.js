"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthProviders = exports.getAuthProvider = void 0;
const database_1 = __importDefault(require("./database"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("./logger"));
const drivers_1 = require("./auth/drivers");
const constants_1 = require("./constants");
const exceptions_1 = require("./exceptions");
const get_config_from_env_1 = require("./utils/get-config-from-env");
const get_schema_1 = require("./utils/get-schema");
const utils_1 = require("@directus/shared/utils");
const providerNames = (0, utils_1.toArray)(env_1.default.AUTH_PROVIDERS);
const providers = new Map();
function getAuthProvider(provider) {
    if (!providers.has(provider)) {
        throw new exceptions_1.InvalidConfigException('Auth provider not configured', { provider });
    }
    return providers.get(provider);
}
exports.getAuthProvider = getAuthProvider;
async function registerAuthProviders() {
    const options = { knex: (0, database_1.default)(), schema: await (0, get_schema_1.getSchema)() };
    // Register default provider if not disabled
    if (!env_1.default.AUTH_DISABLE_DEFAULT) {
        const defaultProvider = getProviderInstance('local', options);
        providers.set(constants_1.DEFAULT_AUTH_PROVIDER, defaultProvider);
    }
    if (!env_1.default.AUTH_PROVIDERS) {
        return;
    }
    // Register configured providers
    providerNames.forEach((name) => {
        name = name.trim();
        if (name === constants_1.DEFAULT_AUTH_PROVIDER) {
            logger_1.default.error(`Cannot override "${constants_1.DEFAULT_AUTH_PROVIDER}" auth provider.`);
            process.exit(1);
        }
        const { driver, ...config } = (0, get_config_from_env_1.getConfigFromEnv)(`AUTH_${name.toUpperCase()}_`);
        if (!driver) {
            logger_1.default.warn(`Missing driver definition for "${name}" auth provider.`);
            return;
        }
        const provider = getProviderInstance(driver, options, { provider: name, ...config });
        if (!provider) {
            logger_1.default.warn(`Invalid "${driver}" auth driver.`);
            return;
        }
        providers.set(name, provider);
    });
}
exports.registerAuthProviders = registerAuthProviders;
function getProviderInstance(driver, options, config = {}) {
    switch (driver) {
        case 'local':
            return new drivers_1.LocalAuthDriver(options, config);
        case 'oauth2':
            return new drivers_1.OAuth2AuthDriver(options, config);
        case 'openid':
            return new drivers_1.OpenIDAuthDriver(options, config);
        case 'ldap':
            return new drivers_1.LDAPAuthDriver(options, config);
        case 'saml':
            return new drivers_1.SAMLAuthDriver(options, config);
    }
}
