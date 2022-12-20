"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
const logger_1 = __importDefault(require("../logger"));
const url_1 = require("url");
/**
 * Check if url matches allow list either exactly or by domain+path
 */
function isUrlAllowed(url, allowList) {
    const urlAllowList = (0, utils_1.toArray)(allowList);
    if (urlAllowList.includes(url))
        return true;
    const parsedWhitelist = urlAllowList.map((allowedURL) => {
        try {
            const { hostname, pathname } = new url_1.URL(allowedURL);
            return hostname + pathname;
        }
        catch {
            logger_1.default.warn(`Invalid URL used "${url}"`);
        }
    });
    try {
        const { hostname, pathname } = new url_1.URL(url);
        return parsedWhitelist.includes(hostname + pathname);
    }
    catch {
        return false;
    }
}
exports.default = isUrlAllowed;
