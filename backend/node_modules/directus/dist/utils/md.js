"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.md = void 0;
const marked_1 = require("marked");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
/**
 * Render and sanitize a markdown string
 */
function md(str) {
    return (0, sanitize_html_1.default)((0, marked_1.marked)(str));
}
exports.md = md;
