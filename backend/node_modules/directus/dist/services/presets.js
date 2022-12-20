"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetsService = void 0;
const items_1 = require("./items");
class PresetsService extends items_1.ItemsService {
    constructor(options) {
        super('directus_presets', options);
    }
}
exports.PresetsService = PresetsService;
