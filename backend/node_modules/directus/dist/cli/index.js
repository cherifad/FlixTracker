"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCli = void 0;
const commander_1 = require("commander");
const server_1 = require("../server");
const emitter_1 = __importDefault(require("../emitter"));
const extensions_1 = require("../extensions");
const bootstrap_1 = __importDefault(require("./commands/bootstrap"));
const count_1 = __importDefault(require("./commands/count"));
const install_1 = __importDefault(require("./commands/database/install"));
const migrate_1 = __importDefault(require("./commands/database/migrate"));
const init_1 = __importDefault(require("./commands/init"));
const key_1 = __importDefault(require("./commands/security/key"));
const secret_1 = __importDefault(require("./commands/security/secret"));
const create_1 = __importDefault(require("./commands/roles/create"));
const create_2 = __importDefault(require("./commands/users/create"));
const passwd_1 = __importDefault(require("./commands/users/passwd"));
const snapshot_1 = require("./commands/schema/snapshot");
const apply_1 = require("./commands/schema/apply");
const pkg = require('../../package.json');
async function createCli() {
    const program = new commander_1.Command();
    const extensionManager = (0, extensions_1.getExtensionManager)();
    await extensionManager.initialize({ schedule: false, watch: false });
    await emitter_1.default.emitInit('cli.before', { program });
    program.name('directus').usage('[command] [options]');
    program.version(pkg.version, '-v, --version');
    program.command('start').description('Start the Directus API').action(server_1.startServer);
    program.command('init').description('Create a new Directus Project').action(init_1.default);
    // Security
    const securityCommand = program.command('security');
    securityCommand.command('key:generate').description('Generate the app key').action(key_1.default);
    securityCommand.command('secret:generate').description('Generate the app secret').action(secret_1.default);
    const dbCommand = program.command('database');
    dbCommand.command('install').description('Install the database').action(install_1.default);
    dbCommand
        .command('migrate:latest')
        .description('Upgrade the database')
        .action(() => (0, migrate_1.default)('latest'));
    dbCommand
        .command('migrate:up')
        .description('Upgrade the database')
        .action(() => (0, migrate_1.default)('up'));
    dbCommand
        .command('migrate:down')
        .description('Downgrade the database')
        .action(() => (0, migrate_1.default)('down'));
    const usersCommand = program.command('users');
    usersCommand
        .command('create')
        .description('Create a new user')
        .option('--email <value>', `user's email`)
        .option('--password <value>', `user's password`)
        .option('--role <value>', `user's role`)
        .action(create_2.default);
    usersCommand
        .command('passwd')
        .description('Set user password')
        .option('--email <value>', `user's email`)
        .option('--password <value>', `user's new password`)
        .action(passwd_1.default);
    const rolesCommand = program.command('roles');
    rolesCommand
        .command('create')
        .description('Create a new role')
        .option('--role <value>', `name for the role`)
        .option('--admin', `whether or not the role has admin access`)
        .action(create_1.default);
    program.command('count <collection>').description('Count the amount of items in a given collection').action(count_1.default);
    program
        .command('bootstrap')
        .description('Initialize or update the database')
        .option('--skipAdminInit', 'Skips the creation of the default Admin Role and User')
        .action(bootstrap_1.default);
    const schemaCommands = program.command('schema');
    schemaCommands
        .command('snapshot')
        .description('Create a new Schema Snapshot')
        .option('-y, --yes', `Assume "yes" as answer to all prompts and run non-interactively`, false)
        .addOption(new commander_1.Option('--format <format>', 'JSON or YAML format').choices(['json', 'yaml']).default('yaml'))
        .argument('[path]', 'Path to snapshot file')
        .action(snapshot_1.snapshot);
    schemaCommands
        .command('apply')
        .description('Apply a snapshot file to the current database')
        .option('-y, --yes', `Assume "yes" as answer to all prompts and run non-interactively`)
        .option('-d, --dry-run', 'Plan and log changes to be applied', false)
        .argument('<path>', 'Path to snapshot file')
        .action(apply_1.apply);
    await emitter_1.default.emitInit('cli.after', { program });
    return program;
}
exports.createCli = createCli;
