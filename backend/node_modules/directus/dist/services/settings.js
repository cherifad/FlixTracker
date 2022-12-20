"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const items_1 = require("./items");
class SettingsService extends items_1.ItemsService {
    constructor(options) {
        super('directus_settings', options);
    }
}
exports.SettingsService = SettingsService;
