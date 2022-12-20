"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const lodash_1 = require("lodash");
async function up(knex) {
    await knex('directus_collections').delete().where('collection', 'like', 'directus_%');
}
exports.up = up;
async function down(knex) {
    const defaults = {
        collection: null,
        hidden: false,
        singleton: false,
        icon: null,
        note: null,
        translations: null,
        display_template: null,
    };
    const systemCollections = [
        {
            collection: 'directus_activity',
            note: 'Accountability logs for all events',
        },
        {
            collection: 'directus_collections',
            icon: 'list_alt',
            note: 'Additional collection configuration and metadata',
        },
        {
            collection: 'directus_fields',
            icon: 'input',
            note: 'Additional field configuration and metadata',
        },
        {
            collection: 'directus_files',
            icon: 'folder',
            note: 'Metadata for all managed file assets',
        },
        {
            collection: 'directus_folders',
            note: 'Provides virtual directories for files',
        },
        {
            collection: 'directus_permissions',
            icon: 'admin_panel_settings',
            note: 'Access permissions for each role',
        },
        {
            collection: 'directus_presets',
            icon: 'bookmark_border',
            note: 'Presets for collection defaults and bookmarks',
        },
        {
            collection: 'directus_relations',
            icon: 'merge_type',
            note: 'Relationship configuration and metadata',
        },
        {
            collection: 'directus_revisions',
            note: 'Data snapshots for all activity',
        },
        {
            collection: 'directus_roles',
            icon: 'supervised_user_circle',
            note: 'Permission groups for system users',
        },
        {
            collection: 'directus_sessions',
            note: 'User session information',
        },
        {
            collection: 'directus_settings',
            singleton: true,
            note: 'Project configuration options',
        },
        {
            collection: 'directus_users',
            archive_field: 'status',
            archive_value: 'archived',
            unarchive_value: 'draft',
            icon: 'people_alt',
            note: 'System users for the platform',
        },
        {
            collection: 'directus_webhooks',
            note: 'Configuration for event-based HTTP requests',
        },
    ].map((row) => {
        for (const [key, value] of Object.entries(row)) {
            if (value !== null && (typeof value === 'object' || Array.isArray(value))) {
                row[key] = JSON.stringify(value);
            }
        }
        return (0, lodash_1.merge)({}, defaults, row);
    });
    await knex.insert(systemCollections).into('directus_collections');
}
exports.down = down;
