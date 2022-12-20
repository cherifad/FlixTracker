"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFAService = void 0;
const otplib_1 = require("otplib");
const database_1 = __importDefault(require("../database"));
const exceptions_1 = require("../exceptions");
const items_1 = require("./items");
class TFAService {
    constructor(options) {
        this.knex = options.knex || (0, database_1.default)();
        this.itemsService = new items_1.ItemsService('directus_users', options);
    }
    async verifyOTP(key, otp, secret) {
        if (secret) {
            return otplib_1.authenticator.check(otp, secret);
        }
        const user = await this.knex.select('tfa_secret').from('directus_users').where({ id: key }).first();
        if (!(user === null || user === void 0 ? void 0 : user.tfa_secret)) {
            throw new exceptions_1.InvalidPayloadException(`User "${key}" doesn't have TFA enabled.`);
        }
        return otplib_1.authenticator.check(otp, user.tfa_secret);
    }
    async generateTFA(key) {
        const user = await this.knex.select('email', 'tfa_secret').from('directus_users').where({ id: key }).first();
        if ((user === null || user === void 0 ? void 0 : user.tfa_secret) !== null) {
            throw new exceptions_1.InvalidPayloadException('TFA Secret is already set for this user');
        }
        if (!(user === null || user === void 0 ? void 0 : user.email)) {
            throw new exceptions_1.InvalidPayloadException('User must have a valid email to enable TFA');
        }
        const secret = otplib_1.authenticator.generateSecret();
        const project = await this.knex.select('project_name').from('directus_settings').limit(1).first();
        return {
            secret,
            url: otplib_1.authenticator.keyuri(user.email, (project === null || project === void 0 ? void 0 : project.project_name) || 'Directus', secret),
        };
    }
    async enableTFA(key, otp, secret) {
        const user = await this.knex.select('tfa_secret').from('directus_users').where({ id: key }).first();
        if ((user === null || user === void 0 ? void 0 : user.tfa_secret) !== null) {
            throw new exceptions_1.InvalidPayloadException('TFA Secret is already set for this user');
        }
        if (!otplib_1.authenticator.check(otp, secret)) {
            throw new exceptions_1.InvalidPayloadException(`"otp" is invalid`);
        }
        await this.itemsService.updateOne(key, { tfa_secret: secret });
    }
    async disableTFA(key) {
        await this.itemsService.updateOne(key, { tfa_secret: null });
    }
}
exports.TFAService = TFAService;
