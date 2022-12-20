"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardsService = void 0;
const items_1 = require("./items");
class DashboardsService extends items_1.ItemsService {
    constructor(options) {
        super('directus_dashboards', options);
    }
}
exports.DashboardsService = DashboardsService;
