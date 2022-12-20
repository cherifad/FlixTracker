"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshot = void 0;
const database_1 = __importDefault(require("../../../database"));
const logger_1 = __importDefault(require("../../../logger"));
const get_snapshot_1 = require("../../../utils/get-snapshot");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const js_yaml_1 = require("js-yaml");
async function snapshot(snapshotPath, options) {
    const database = (0, database_1.default)();
    try {
        const snapshot = await (0, get_snapshot_1.getSnapshot)({ database });
        let snapshotString;
        if ((options === null || options === void 0 ? void 0 : options.format) === 'yaml') {
            snapshotString = (0, js_yaml_1.dump)(snapshot);
        }
        else {
            snapshotString = JSON.stringify(snapshot);
        }
        if (snapshotPath) {
            const filename = path_1.default.resolve(process.cwd(), snapshotPath);
            let snapshotExists;
            try {
                await fs_1.promises.access(filename, fs_1.constants.F_OK);
                snapshotExists = true;
            }
            catch {
                snapshotExists = false;
            }
            if (snapshotExists && (options === null || options === void 0 ? void 0 : options.yes) === false) {
                const { overwrite } = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'overwrite',
                        message: 'Snapshot already exists. Do you want to overwrite the file?',
                    },
                ]);
                if (overwrite === false) {
                    database.destroy();
                    process.exit(0);
                }
            }
            await fs_1.promises.writeFile(filename, snapshotString);
            logger_1.default.info(`Snapshot saved to ${filename}`);
        }
        else {
            process.stdout.write(snapshotString);
        }
        database.destroy();
        process.exit(0);
    }
    catch (err) {
        logger_1.default.error(err);
        database.destroy();
        process.exit(1);
    }
}
exports.snapshot = snapshot;
