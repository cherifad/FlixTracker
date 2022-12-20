"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
const database_1 = __importDefault(require("../database"));
const collections_1 = require("../database/system-data/collections");
const exceptions_1 = require("../exceptions");
const emitter_1 = __importDefault(require("../emitter"));
class UtilsService {
    constructor(options) {
        this.knex = options.knex || (0, database_1.default)();
        this.accountability = options.accountability || null;
        this.schema = options.schema;
    }
    async sort(collection, { item, to }) {
        var _a, _b, _c, _d;
        const sortFieldResponse = (await this.knex.select('sort_field').from('directus_collections').where({ collection }).first()) ||
            collections_1.systemCollectionRows;
        const sortField = sortFieldResponse === null || sortFieldResponse === void 0 ? void 0 : sortFieldResponse.sort_field;
        if (!sortField) {
            throw new exceptions_1.InvalidPayloadException(`Collection "${collection}" doesn't have a sort field.`);
        }
        if (((_a = this.accountability) === null || _a === void 0 ? void 0 : _a.admin) !== true) {
            const permissions = (_c = (_b = this.accountability) === null || _b === void 0 ? void 0 : _b.permissions) === null || _c === void 0 ? void 0 : _c.find((permission) => {
                return permission.collection === collection && permission.action === 'update';
            });
            if (!permissions) {
                throw new exceptions_1.ForbiddenException();
            }
            const allowedFields = (_d = permissions.fields) !== null && _d !== void 0 ? _d : [];
            if (allowedFields[0] !== '*' && allowedFields.includes(sortField) === false) {
                throw new exceptions_1.ForbiddenException();
            }
        }
        const primaryKeyField = this.schema.collections[collection].primary;
        // Make sure all rows have a sort value
        const countResponse = await this.knex.count('* as count').from(collection).whereNull(sortField).first();
        if ((countResponse === null || countResponse === void 0 ? void 0 : countResponse.count) && +countResponse.count !== 0) {
            const lastSortValueResponse = await this.knex.max(sortField).from(collection).first();
            const rowsWithoutSortValue = await this.knex
                .select(primaryKeyField, sortField)
                .from(collection)
                .whereNull(sortField);
            let lastSortValue = lastSortValueResponse ? Object.values(lastSortValueResponse)[0] : 0;
            for (const row of rowsWithoutSortValue) {
                lastSortValue++;
                await this.knex(collection)
                    .update({ [sortField]: lastSortValue })
                    .where({ [primaryKeyField]: row[primaryKeyField] });
            }
        }
        // Check to see if there's any duplicate values in the sort counts. If that's the case, we'll have to
        // reset the count values, otherwise the sort operation will cause unexpected results
        const duplicates = await this.knex
            .select(sortField)
            .count(sortField, { as: 'count' })
            .groupBy(sortField)
            .from(collection)
            .havingRaw('count(??) > 1', [sortField]);
        if ((duplicates === null || duplicates === void 0 ? void 0 : duplicates.length) > 0) {
            const ids = await this.knex.select(primaryKeyField).from(collection).orderBy(sortField);
            // This might not scale that well, but I don't really know how to accurately set all rows
            // to a sequential value that works cross-DB vendor otherwise
            for (let i = 0; i < ids.length; i++) {
                await this.knex(collection)
                    .update({ [sortField]: i + 1 })
                    .where(ids[i]);
            }
        }
        const targetSortValueResponse = await this.knex
            .select(sortField)
            .from(collection)
            .where({ [primaryKeyField]: to })
            .first();
        const targetSortValue = targetSortValueResponse[sortField];
        const sourceSortValueResponse = await this.knex
            .select(sortField)
            .from(collection)
            .where({ [primaryKeyField]: item })
            .first();
        const sourceSortValue = sourceSortValueResponse[sortField];
        // Set the target item to the new sort value
        await this.knex(collection)
            .update({ [sortField]: targetSortValue })
            .where({ [primaryKeyField]: item });
        if (sourceSortValue < targetSortValue) {
            await this.knex(collection)
                .decrement(sortField, 1)
                .where(sortField, '>', sourceSortValue)
                .andWhere(sortField, '<=', targetSortValue)
                .andWhereNot({ [primaryKeyField]: item });
        }
        else {
            await this.knex(collection)
                .increment(sortField, 1)
                .where(sortField, '>=', targetSortValue)
                .andWhere(sortField, '<=', sourceSortValue)
                .andWhereNot({ [primaryKeyField]: item });
        }
        emitter_1.default.emitAction(['items.sort', `${collection}.items.sort`], {
            collection,
            item,
            to,
        }, {
            database: this.knex,
            schema: this.schema,
            accountability: this.accountability,
        });
    }
}
exports.UtilsService = UtilsService;
