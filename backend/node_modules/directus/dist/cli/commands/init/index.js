"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const run_1 = __importDefault(require("../../../database/migrations/run"));
const run_2 = __importDefault(require("../../../database/seeds/run"));
const create_db_connection_1 = __importDefault(require("../../utils/create-db-connection"));
const create_env_1 = __importDefault(require("../../utils/create-env"));
const drivers_1 = require("../../utils/drivers");
const questions_1 = require("./questions");
const generate_hash_1 = require("../../../utils/generate-hash");
const defaults_1 = require("../../utils/defaults");
async function init() {
    const rootPath = process.cwd();
    const { client } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'client',
            message: 'Choose your database client',
            choices: Object.values(drivers_1.drivers),
        },
    ]);
    const dbClient = (0, drivers_1.getDriverForClient)(client);
    const spinnerDriver = (0, ora_1.default)('Installing Database Driver...').start();
    await (0, execa_1.default)('npm', ['install', dbClient, '--production']);
    spinnerDriver.stop();
    let attemptsRemaining = 5;
    const { credentials, db } = await trySeed();
    async function trySeed() {
        const credentials = await inquirer_1.default.prompt(questions_1.databaseQuestions[dbClient].map((question) => question({ client: dbClient, filepath: rootPath })));
        const db = (0, create_db_connection_1.default)(dbClient, credentials);
        try {
            await (0, run_2.default)(db);
            await (0, run_1.default)(db, 'latest', false);
        }
        catch (err) {
            process.stdout.write('\nSomething went wrong while seeding the database:\n');
            process.stdout.write(`\n${chalk_1.default.red(`[${err.code || 'Error'}]`)} ${err.message}\n`);
            process.stdout.write('\nPlease try again\n\n');
            attemptsRemaining--;
            if (attemptsRemaining > 0) {
                return await trySeed();
            }
            else {
                process.stdout.write("Couldn't seed the database. Exiting.\n");
                process.exit(1);
            }
        }
        return { credentials, db };
    }
    await (0, create_env_1.default)(dbClient, credentials, rootPath);
    process.stdout.write('\nCreate your first admin user:\n\n');
    const firstUser = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Email',
            default: 'admin@example.com',
            validate: (input) => {
                const emailSchema = joi_1.default.string().email().required();
                const { error } = emailSchema.validate(input);
                if (error)
                    throw new Error('The email entered is not a valid email address!');
                return true;
            },
        },
        {
            type: 'password',
            name: 'password',
            message: 'Password',
            mask: '*',
            validate: (input) => {
                if (input === null || input === '')
                    throw new Error('The password cannot be empty!');
                return true;
            },
        },
    ]);
    firstUser.password = await (0, generate_hash_1.generateHash)(firstUser.password);
    const userID = (0, uuid_1.v4)();
    const roleID = (0, uuid_1.v4)();
    await db('directus_roles').insert({
        id: roleID,
        ...defaults_1.defaultAdminRole,
    });
    await db('directus_users').insert({
        id: userID,
        email: firstUser.email,
        password: firstUser.password,
        role: roleID,
        ...defaults_1.defaultAdminUser,
    });
    await db.destroy();
    process.stdout.write(`\nYour project has been created at ${chalk_1.default.green(rootPath)}.\n`);
    process.stdout.write(`\nThe configuration can be found in ${chalk_1.default.green(rootPath + '/.env')}\n`);
    process.stdout.write(`\nStart Directus by running:\n`);
    process.stdout.write(`  ${chalk_1.default.blue('cd')} ${rootPath}\n`);
    process.stdout.write(`  ${chalk_1.default.blue('npx directus')} start\n`);
    process.exit(0);
}
exports.default = init;
