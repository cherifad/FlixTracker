"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldersService = void 0;
const items_1 = require("./items");
class FoldersService extends items_1.ItemsService {
    constructor(options) {
        super('directus_folders', options);
    }
}
exports.FoldersService = FoldersService;
