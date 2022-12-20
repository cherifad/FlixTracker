"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
const eventemitter2_1 = require("eventemitter2");
const logger_1 = __importDefault(require("./logger"));
class Emitter {
    constructor() {
        const emitterOptions = {
            wildcard: true,
            verboseMemoryLeak: true,
            delimiter: '.',
            // This will ignore the "unspecified event" error
            ignoreErrors: true,
        };
        this.filterEmitter = new eventemitter2_1.EventEmitter2(emitterOptions);
        this.actionEmitter = new eventemitter2_1.EventEmitter2(emitterOptions);
        this.initEmitter = new eventemitter2_1.EventEmitter2(emitterOptions);
    }
    async emitFilter(event, payload, meta, context) {
        const events = Array.isArray(event) ? event : [event];
        const eventListeners = events.map((event) => ({
            event,
            listeners: this.filterEmitter.listeners(event),
        }));
        let updatedPayload = payload;
        for (const { event, listeners } of eventListeners) {
            for (const listener of listeners) {
                const result = await listener(updatedPayload, { event, ...meta }, context);
                if (result !== undefined) {
                    updatedPayload = result;
                }
            }
        }
        return updatedPayload;
    }
    emitAction(event, meta, context) {
        const events = Array.isArray(event) ? event : [event];
        for (const event of events) {
            this.actionEmitter.emitAsync(event, { event, ...meta }, context).catch((err) => {
                logger_1.default.warn(`An error was thrown while executing action "${event}"`);
                logger_1.default.warn(err);
            });
        }
    }
    async emitInit(event, meta) {
        try {
            await this.initEmitter.emitAsync(event, { event, ...meta });
        }
        catch (err) {
            logger_1.default.warn(`An error was thrown while executing init "${event}"`);
            logger_1.default.warn(err);
        }
    }
    onFilter(event, handler) {
        this.filterEmitter.on(event, handler);
    }
    onAction(event, handler) {
        this.actionEmitter.on(event, handler);
    }
    onInit(event, handler) {
        this.initEmitter.on(event, handler);
    }
    offFilter(event, handler) {
        this.filterEmitter.off(event, handler);
    }
    offAction(event, handler) {
        this.actionEmitter.off(event, handler);
    }
    offInit(event, handler) {
        this.initEmitter.off(event, handler);
    }
    offAll() {
        this.filterEmitter.removeAllListeners();
        this.actionEmitter.removeAllListeners();
        this.initEmitter.removeAllListeners();
    }
}
exports.Emitter = Emitter;
const emitter = new Emitter();
exports.default = emitter;
