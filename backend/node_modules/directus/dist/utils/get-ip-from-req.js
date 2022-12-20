"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPFromReq = void 0;
const net_1 = require("net");
const env_1 = __importDefault(require("../env"));
const logger_1 = __importDefault(require("../logger"));
function getIPFromReq(req) {
    let ip = req.ip;
    if (env_1.default.IP_CUSTOM_HEADER) {
        const customIPHeaderValue = req.get(env_1.default.IP_CUSTOM_HEADER);
        if (typeof customIPHeaderValue === 'string' && (0, net_1.isIP)(customIPHeaderValue) !== 0) {
            ip = customIPHeaderValue;
        }
        else {
            logger_1.default.warn(`Custom IP header didn't return valid IP address: ${JSON.stringify(customIPHeaderValue)}`);
        }
    }
    // IP addresses starting with ::ffff: are IPv4 addresses in IPv6 format. We can strip the prefix to get back to IPv4
    return ip.startsWith('::ffff:') ? ip.substring(7) : ip;
}
exports.getIPFromReq = getIPFromReq;
