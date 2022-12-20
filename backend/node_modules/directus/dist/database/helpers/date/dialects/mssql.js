"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelperMSSQL = void 0;
const types_1 = require("../types");
const date_fns_1 = require("date-fns");
class DateHelperMSSQL extends types_1.DateHelper {
    writeTimestamp(date) {
        const parsedDate = (0, date_fns_1.parseISO)(date);
        return new Date(parsedDate.getTime() + parsedDate.getTimezoneOffset() * 60000);
    }
}
exports.DateHelperMSSQL = DateHelperMSSQL;
