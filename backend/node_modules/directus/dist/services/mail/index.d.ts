import { Knex } from 'knex';
import { AbstractServiceOptions } from '../../types';
import { Accountability, SchemaOverview } from '@directus/shared/types';
import { Transporter, SendMailOptions } from 'nodemailer';
export type EmailOptions = SendMailOptions & {
    template?: {
        name: string;
        data: Record<string, any>;
    };
};
export declare class MailService {
    schema: SchemaOverview;
    accountability: Accountability | null;
    knex: Knex;
    mailer: Transporter;
    constructor(opts: AbstractServiceOptions);
    send<T>(options: EmailOptions): Promise<T>;
    private renderTemplate;
    private getDefaultTemplateData;
}
