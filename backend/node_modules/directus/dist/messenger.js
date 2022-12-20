"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessenger = exports.MessengerRedis = exports.MessengerMemory = void 0;
const utils_1 = require("@directus/shared/utils");
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = __importDefault(require("./env"));
const get_config_from_env_1 = require("./utils/get-config-from-env");
class MessengerMemory {
    constructor() {
        this.handlers = {};
    }
    publish(channel, payload) {
        var _a, _b;
        (_b = (_a = this.handlers)[channel]) === null || _b === void 0 ? void 0 : _b.call(_a, payload);
    }
    subscribe(channel, callback) {
        this.handlers[channel] = callback;
    }
    unsubscribe(channel) {
        delete this.handlers[channel];
    }
}
exports.MessengerMemory = MessengerMemory;
class MessengerRedis {
    constructor() {
        var _a, _b, _c;
        const config = (0, get_config_from_env_1.getConfigFromEnv)('MESSENGER_REDIS');
        this.pub = new ioredis_1.default((_a = env_1.default.MESSENGER_REDIS) !== null && _a !== void 0 ? _a : config);
        this.sub = new ioredis_1.default((_b = env_1.default.MESSENGER_REDIS) !== null && _b !== void 0 ? _b : config);
        this.namespace = (_c = env_1.default.MESSENGER_NAMESPACE) !== null && _c !== void 0 ? _c : 'directus';
    }
    publish(channel, payload) {
        this.pub.publish(`${this.namespace}:${channel}`, JSON.stringify(payload));
    }
    subscribe(channel, callback) {
        this.sub.subscribe(`${this.namespace}:${channel}`);
        this.sub.on('message', (messageChannel, payloadString) => {
            const payload = (0, utils_1.parseJSON)(payloadString);
            if (messageChannel === `${this.namespace}:${channel}`) {
                callback(payload);
            }
        });
    }
    unsubscribe(channel) {
        this.sub.unsubscribe(`${this.namespace}:${channel}`);
    }
}
exports.MessengerRedis = MessengerRedis;
let messenger;
function getMessenger() {
    if (messenger)
        return messenger;
    if (env_1.default.MESSENGER_STORE === 'redis') {
        messenger = new MessengerRedis();
    }
    else {
        messenger = new MessengerMemory();
    }
    return messenger;
}
exports.getMessenger = getMessenger;
