import { DateHelper } from '../types';
export declare class DateHelperSQLite extends DateHelper {
    parse(date: string | Date): string;
    fieldFlagForField(fieldType: string): string;
}
