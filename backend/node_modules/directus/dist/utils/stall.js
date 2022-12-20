"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stall = void 0;
const perf_hooks_1 = require("perf_hooks");
/**
 * Wait a specific time to meet the stall ms. Useful in cases where you need to make sure that every
 * path in a function takes at least X ms (for example authenticate).
 *
 * @param {number} ms - Stall time to wait until
 * @param {number} start - Current start time of the function
 *
 * @example
 *
 * ```js
 * const STALL_TIME = 100;
 *
 * // Function will always take (at least) 100ms
 * async function doSomething() {
 *   const timeStart = performance.now();
 *
 *   if (something === true) {
 *     await heavy();
 *   }
 *
 *   stall(STALL_TIME, timeStart);
 *   return 'result';
 * }
 * ```
 */
async function stall(ms, start) {
    const now = perf_hooks_1.performance.now();
    const timeElapsed = now - start;
    const timeRemaining = ms - timeElapsed;
    if (timeRemaining <= 0)
        return;
    return new Promise((resolve) => setTimeout(resolve, timeRemaining));
}
exports.stall = stall;
