"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const types_1 = require("../types");
const date_fns_1 = require("date-fns");
class DateHelper extends types_1.DatabaseHelper {
    parse(date) {
        // Date generated from NOW()
        if (date instanceof Date) {
            return date.toISOString();
        }
        return date;
    }
    readTimestampString(date) {
        return date;
    }
    writeTimestamp(date) {
        return (0, date_fns_1.parseISO)(date);
    }
    fieldFlagForField(_fieldType) {
        return '';
    }
}
exports.DateHelper = DateHelper;
