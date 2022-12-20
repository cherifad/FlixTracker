"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringByteSize = void 0;
/**
 * Returns the byte size for a given input string
 */
function stringByteSize(string) {
    return Buffer.byteLength(string, 'utf-8');
}
exports.stringByteSize = stringByteSize;
