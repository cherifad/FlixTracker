"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const items_1 = require("./items");
const md_1 = require("../utils/md");
const url_1 = require("../utils/url");
const users_1 = require("./users");
const mail_1 = require("./mail");
const logger_1 = __importDefault(require("../logger"));
const env_1 = __importDefault(require("../env"));
class NotificationsService extends items_1.ItemsService {
    constructor(options) {
        super('directus_notifications', options);
        this.usersService = new users_1.UsersService({ schema: this.schema });
        this.mailService = new mail_1.MailService({ schema: this.schema, accountability: this.accountability });
    }
    async createOne(data, opts) {
        const response = await super.createOne(data, opts);
        await this.sendEmail(data);
        return response;
    }
    async createMany(data, opts) {
        const response = await super.createMany(data, opts);
        for (const notification of data) {
            await this.sendEmail(notification);
        }
        return response;
    }
    async sendEmail(data) {
        var _a;
        if (data.recipient) {
            const user = await this.usersService.readOne(data.recipient, {
                fields: ['id', 'email', 'email_notifications', 'role.app_access'],
            });
            const manageUserAccountUrl = new url_1.Url(env_1.default.PUBLIC_URL).addPath('admin', 'users', user.id).toString();
            const html = data.message ? (0, md_1.md)(data.message) : '';
            if (user.email && user.email_notifications === true) {
                try {
                    await this.mailService.send({
                        template: {
                            name: 'base',
                            data: ((_a = user.role) === null || _a === void 0 ? void 0 : _a.app_access) ? { url: manageUserAccountUrl, html } : { html },
                        },
                        to: user.email,
                        subject: data.subject,
                    });
                }
                catch (error) {
                    logger_1.default.error(error.message);
                }
            }
        }
    }
}
exports.NotificationsService = NotificationsService;
