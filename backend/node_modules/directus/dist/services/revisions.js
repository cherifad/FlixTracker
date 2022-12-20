"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevisionsService = void 0;
const exceptions_1 = require("../exceptions");
const index_1 = require("./index");
class RevisionsService extends index_1.ItemsService {
    constructor(options) {
        super('directus_revisions', options);
    }
    async revert(pk) {
        const revision = await super.readOne(pk);
        if (!revision)
            throw new exceptions_1.ForbiddenException();
        if (!revision.data)
            throw new exceptions_1.InvalidPayloadException(`Revision doesn't contain data to revert to`);
        const service = new index_1.ItemsService(revision.collection, {
            accountability: this.accountability,
            knex: this.knex,
            schema: this.schema,
        });
        await service.updateOne(revision.item, revision.data);
    }
}
exports.RevisionsService = RevisionsService;
