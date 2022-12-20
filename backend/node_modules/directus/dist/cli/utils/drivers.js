"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverForClient = exports.drivers = void 0;
exports.drivers = {
    pg: 'PostgreSQL / Redshift',
    cockroachdb: 'CockroachDB (Beta)',
    mysql: 'MySQL / MariaDB / Aurora',
    sqlite3: 'SQLite',
    mssql: 'Microsoft SQL Server',
    oracledb: 'Oracle Database',
};
function getDriverForClient(client) {
    for (const [key, value] of Object.entries(exports.drivers)) {
        if (value === client)
            return key;
    }
    return null;
}
exports.getDriverForClient = getDriverForClient;
