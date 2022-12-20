"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeExtractFormat = exports.resolvePreset = void 0;
const lodash_1 = require("lodash");
// Extract transforms from a preset
function resolvePreset(input, file) {
    var _a;
    // Do the format conversion last
    return [extractResize(input), ...((_a = input.transforms) !== null && _a !== void 0 ? _a : []), extractToFormat(input, file)].filter((transform) => transform !== undefined);
}
exports.resolvePreset = resolvePreset;
function extractOptions(keys, numberKeys = [], booleanKeys = []) {
    return function (input) {
        return Object.entries(input).reduce((config, [key, value]) => keys.includes(key) && (0, lodash_1.isNil)(value) === false
            ? {
                ...config,
                [key]: numberKeys.includes(key)
                    ? +value
                    : booleanKeys.includes(key)
                        ? Boolean(value)
                        : value,
            }
            : config, {});
    };
}
// Extract format transform from a preset
function extractToFormat(input, file) {
    const options = extractOptions(['format', 'quality'], ['quality'])(input);
    return Object.keys(options).length > 0
        ? [
            'toFormat',
            options.format || file.type.split('/')[1],
            {
                quality: options.quality,
            },
        ]
        : undefined;
}
function extractResize(input) {
    const resizable = ['width', 'height'].some((key) => key in input);
    if (!resizable)
        return undefined;
    return [
        'resize',
        extractOptions(['width', 'height', 'fit', 'withoutEnlargement'], ['width', 'height'], ['withoutEnlargement'])(input),
    ];
}
/**
 * Try to extract a file format from an array of `Transformation`'s.
 */
function maybeExtractFormat(transforms) {
    var _a;
    const toFormats = transforms.filter((t) => t[0] === 'toFormat');
    const lastToFormat = toFormats[toFormats.length - 1];
    return lastToFormat ? (_a = lastToFormat[1]) === null || _a === void 0 ? void 0 : _a.toString() : undefined;
}
exports.maybeExtractFormat = maybeExtractFormat;
