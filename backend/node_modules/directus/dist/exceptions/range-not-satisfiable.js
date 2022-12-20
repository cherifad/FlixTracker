"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeNotSatisfiableException = void 0;
const exceptions_1 = require("@directus/shared/exceptions");
class RangeNotSatisfiableException extends exceptions_1.BaseException {
    constructor(range) {
        var _a, _b;
        const rangeString = range && ((range === null || range === void 0 ? void 0 : range.start) !== undefined || (range === null || range === void 0 ? void 0 : range.end) !== undefined)
            ? `"${(_a = range.start) !== null && _a !== void 0 ? _a : ''}-${(_b = range.end) !== null && _b !== void 0 ? _b : ''}" `
            : '';
        super(`Range ${rangeString}is invalid or the file's size doesn't match the requested range.`, 416, 'RANGE_NOT_SATISFIABLE');
    }
}
exports.RangeNotSatisfiableException = RangeNotSatisfiableException;
