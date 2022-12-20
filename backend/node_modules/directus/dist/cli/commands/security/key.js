"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
async function generateKey() {
    process.stdout.write((0, uuid_1.v4)());
    process.exit(0);
}
exports.default = generateKey;
