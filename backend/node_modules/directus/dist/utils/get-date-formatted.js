"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateFormatted = void 0;
function getDateFormatted() {
    const date = new Date();
    let month = String(date.getMonth() + 1);
    if (month.length === 1)
        month = '0' + month;
    let day = String(date.getDate());
    if (day.length === 1)
        day = '0' + day;
    return `${date.getFullYear()}${month}${day}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
}
exports.getDateFormatted = getDateFormatted;
