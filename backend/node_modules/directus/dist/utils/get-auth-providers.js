"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthProviders = void 0;
const utils_1 = require("@directus/shared/utils");
const env_1 = __importDefault(require("../env"));
function getAuthProviders() {
    return (0, utils_1.toArray)(env_1.default.AUTH_PROVIDERS)
        .filter((provider) => provider && env_1.default[`AUTH_${provider.toUpperCase()}_DRIVER`])
        .map((provider) => ({
        name: provider,
        label: env_1.default[`AUTH_${provider.toUpperCase()}_LABEL`],
        driver: env_1.default[`AUTH_${provider.toUpperCase()}_DRIVER`],
        icon: env_1.default[`AUTH_${provider.toUpperCase()}_ICON`],
    }));
}
exports.getAuthProviders = getAuthProviders;
