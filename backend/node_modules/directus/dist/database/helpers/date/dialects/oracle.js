"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelperOracle = void 0;
const types_1 = require("../types");
class DateHelperOracle extends types_1.DateHelper {
    fieldFlagForField(fieldType) {
        switch (fieldType) {
            case 'dateTime':
                return 'cast-datetime';
            default:
                return '';
        }
    }
}
exports.DateHelperOracle = DateHelperOracle;
