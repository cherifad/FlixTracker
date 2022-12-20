"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const liquidjs_1 = require("liquidjs");
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../../database"));
const env_1 = __importDefault(require("../../env"));
const exceptions_1 = require("../../exceptions");
const logger_1 = __importDefault(require("../../logger"));
const mailer_1 = __importDefault(require("../../mailer"));
const url_1 = require("../../utils/url");
const liquidEngine = new liquidjs_1.Liquid({
    root: [path_1.default.resolve(env_1.default.EXTENSIONS_PATH, 'templates'), path_1.default.resolve(__dirname, 'templates')],
    extname: '.liquid',
});
class MailService {
    constructor(opts) {
        this.schema = opts.schema;
        this.accountability = opts.accountability || null;
        this.knex = (opts === null || opts === void 0 ? void 0 : opts.knex) || (0, database_1.default)();
        this.mailer = (0, mailer_1.default)();
        if (env_1.default.EMAIL_VERIFY_SETUP) {
            this.mailer.verify((error) => {
                if (error) {
                    logger_1.default.warn(`Email connection failed:`);
                    logger_1.default.warn(error);
                }
            });
        }
    }
    async send(options) {
        const { template, ...emailOptions } = options;
        let { html } = options;
        const defaultTemplateData = await this.getDefaultTemplateData();
        const from = `${defaultTemplateData.projectName} <${options.from || env_1.default.EMAIL_FROM}>`;
        if (template) {
            let templateData = template.data;
            templateData = {
                ...defaultTemplateData,
                ...templateData,
            };
            html = await this.renderTemplate(template.name, templateData);
        }
        if (typeof html === 'string') {
            // Some email clients start acting funky when line length exceeds 75 characters. See #6074
            html = html
                .split('\n')
                .map((line) => line.trim())
                .join('\n');
        }
        const info = await this.mailer.sendMail({ ...emailOptions, from, html });
        return info;
    }
    async renderTemplate(template, variables) {
        const customTemplatePath = path_1.default.resolve(env_1.default.EXTENSIONS_PATH, 'templates', template + '.liquid');
        const systemTemplatePath = path_1.default.join(__dirname, 'templates', template + '.liquid');
        const templatePath = (await fs_extra_1.default.pathExists(customTemplatePath)) ? customTemplatePath : systemTemplatePath;
        if ((await fs_extra_1.default.pathExists(templatePath)) === false) {
            throw new exceptions_1.InvalidPayloadException(`Template "${template}" doesn't exist.`);
        }
        const templateString = await fs_extra_1.default.readFile(templatePath, 'utf8');
        const html = await liquidEngine.parseAndRender(templateString, variables);
        return html;
    }
    async getDefaultTemplateData() {
        const projectInfo = await this.knex
            .select(['project_name', 'project_logo', 'project_color', 'project_url'])
            .from('directus_settings')
            .first();
        return {
            projectName: (projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.project_name) || 'Directus',
            projectColor: (projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.project_color) || '#546e7a',
            projectLogo: getProjectLogoURL(projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.project_logo),
            projectUrl: (projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.project_url) || '',
        };
        function getProjectLogoURL(logoID) {
            const projectLogoUrl = new url_1.Url(env_1.default.PUBLIC_URL);
            if (logoID) {
                projectLogoUrl.addPath('assets', logoID);
            }
            else {
                projectLogoUrl.addPath('admin', 'img', 'directus-white.png');
            }
            return projectLogoUrl.toString();
        }
    }
}
exports.MailService = MailService;
