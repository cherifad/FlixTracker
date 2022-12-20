export declare const drivers: {
    pg: string;
    cockroachdb: string;
    mysql: string;
    sqlite3: string;
    mssql: string;
    oracledb: string;
};
export declare function getDriverForClient(client: string): keyof typeof drivers | null;
