"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelsService = void 0;
const items_1 = require("./items");
class PanelsService extends items_1.ItemsService {
    constructor(options) {
        super('directus_panels', options);
    }
}
exports.PanelsService = PanelsService;
