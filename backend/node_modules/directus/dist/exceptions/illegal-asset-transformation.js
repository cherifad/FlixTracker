"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalAssetTransformation = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class IllegalAssetTransformation extends exceptions_1.BaseException {
    constructor(message) {
        super(message, 400, 'ILLEGAL_ASSET_TRANSFORMATION');
    }
}
exports.IllegalAssetTransformation = IllegalAssetTransformation;
