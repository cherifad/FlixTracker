"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompress = exports.compress = void 0;
const snappy_1 = require("snappy");
const utils_1 = require("@directus/shared/utils");
async function compress(raw) {
    if (!raw)
        return raw;
    return await (0, snappy_1.compress)((0, utils_1.compress)(raw));
}
exports.compress = compress;
async function decompress(compressed) {
    if (!compressed)
        return compressed;
    return (0, utils_1.decompress)((await (0, snappy_1.uncompress)(compressed, { asBuffer: false })));
}
exports.decompress = decompress;
