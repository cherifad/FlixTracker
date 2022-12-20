import { MSSQLError } from './types';
export declare function extractError(error: MSSQLError): Promise<MSSQLError | Error>;
