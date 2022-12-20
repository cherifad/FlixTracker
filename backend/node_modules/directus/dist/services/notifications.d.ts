import { AbstractServiceOptions, PrimaryKey, MutationOptions } from '../types';
import { ItemsService } from './items';
import { Notification } from '@directus/shared/types';
import { UsersService } from './users';
import { MailService } from './mail';
export declare class NotificationsService extends ItemsService {
    usersService: UsersService;
    mailService: MailService;
    constructor(options: AbstractServiceOptions);
    createOne(data: Partial<Notification>, opts?: MutationOptions): Promise<PrimaryKey>;
    createMany(data: Partial<Notification>[], opts?: MutationOptions): Promise<PrimaryKey[]>;
    sendEmail(data: Partial<Notification>): Promise<void>;
}
