"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("./logger"));
const get_config_from_env_1 = require("./utils/get-config-from-env");
let transporter;
function getMailer() {
    if (transporter)
        return transporter;
    const transportName = env_1.default.EMAIL_TRANSPORT.toLowerCase();
    if (transportName === 'sendmail') {
        transporter = nodemailer_1.default.createTransport({
            sendmail: true,
            newline: env_1.default.EMAIL_SENDMAIL_NEW_LINE || 'unix',
            path: env_1.default.EMAIL_SENDMAIL_PATH || '/usr/sbin/sendmail',
        });
    }
    else if (transportName === 'ses') {
        const aws = require('@aws-sdk/client-ses');
        const sesOptions = (0, get_config_from_env_1.getConfigFromEnv)('EMAIL_SES_');
        const ses = new aws.SES(sesOptions);
        transporter = nodemailer_1.default.createTransport({
            SES: { ses, aws },
        });
    }
    else if (transportName === 'smtp') {
        let auth = false;
        if (env_1.default.EMAIL_SMTP_USER || env_1.default.EMAIL_SMTP_PASSWORD) {
            auth = {
                user: env_1.default.EMAIL_SMTP_USER,
                pass: env_1.default.EMAIL_SMTP_PASSWORD,
            };
        }
        const tls = (0, get_config_from_env_1.getConfigFromEnv)('EMAIL_SMTP_TLS_');
        transporter = nodemailer_1.default.createTransport({
            name: env_1.default.EMAIL_SMTP_NAME,
            pool: env_1.default.EMAIL_SMTP_POOL,
            host: env_1.default.EMAIL_SMTP_HOST,
            port: env_1.default.EMAIL_SMTP_PORT,
            secure: env_1.default.EMAIL_SMTP_SECURE,
            ignoreTLS: env_1.default.EMAIL_SMTP_IGNORE_TLS,
            auth,
            tls,
        });
    }
    else if (transportName === 'mailgun') {
        const mg = require('nodemailer-mailgun-transport');
        transporter = nodemailer_1.default.createTransport(mg({
            auth: {
                api_key: env_1.default.EMAIL_MAILGUN_API_KEY,
                domain: env_1.default.EMAIL_MAILGUN_DOMAIN,
            },
            host: env_1.default.EMAIL_MAILGUN_HOST || 'api.mailgun.net',
        }));
    }
    else if (transportName === 'sendgrid') {
        const sg = require('nodemailer-sendgrid');
        transporter = nodemailer_1.default.createTransport(sg({
            apiKey: env_1.default.EMAIL_SENDGRID_API_KEY,
        }));
    }
    else {
        logger_1.default.warn('Illegal transport given for email. Check the EMAIL_TRANSPORT env var.');
    }
    return transporter;
}
exports.default = getMailer;
