"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelperSQLite = void 0;
const types_1 = require("../types");
class DateHelperSQLite extends types_1.DateHelper {
    parse(date) {
        if (!date) {
            return date;
        }
        // Date generated from NOW()
        if (date instanceof Date) {
            return String(date.getTime());
        }
        // Return the time as string
        if (date.length <= 8 && date.includes(':')) {
            return date;
        }
        // Return dates in epoch milliseconds
        return String(new Date(date).getTime());
    }
    fieldFlagForField(fieldType) {
        switch (fieldType) {
            case 'timestamp':
                return 'cast-timestamp';
            default:
                return '';
        }
    }
}
exports.DateHelperSQLite = DateHelperSQLite;
