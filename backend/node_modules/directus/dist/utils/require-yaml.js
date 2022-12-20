"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireYAML = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
function requireYAML(filepath) {
    const yamlRaw = fs_extra_1.default.readFileSync(filepath, 'utf8');
    return js_yaml_1.default.load(yamlRaw);
}
exports.requireYAML = requireYAML;
