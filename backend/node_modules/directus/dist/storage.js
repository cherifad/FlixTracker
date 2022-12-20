"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drive_1 = require("@directus/drive");
const drive_azure_1 = require("@directus/drive-azure");
const drive_gcs_1 = require("@directus/drive-gcs");
const drive_s3_1 = require("@directus/drive-s3");
const env_1 = __importDefault(require("./env"));
const get_config_from_env_1 = require("./utils/get-config-from-env");
const utils_1 = require("@directus/shared/utils");
const validate_env_1 = require("./utils/validate-env");
(0, validate_env_1.validateEnv)(['STORAGE_LOCATIONS']);
const storage = new drive_1.StorageManager(getStorageConfig());
registerDrivers(storage);
exports.default = storage;
function getStorageConfig() {
    const config = {
        disks: {},
    };
    const locations = (0, utils_1.toArray)(env_1.default.STORAGE_LOCATIONS);
    locations.forEach((location) => {
        location = location.trim();
        const diskConfig = {
            driver: env_1.default[`STORAGE_${location.toUpperCase()}_DRIVER`],
            config: (0, get_config_from_env_1.getConfigFromEnv)(`STORAGE_${location.toUpperCase()}_`),
        };
        delete diskConfig.config.publicUrl;
        delete diskConfig.config.driver;
        config.disks[location] = diskConfig;
    });
    return config;
}
function registerDrivers(storage) {
    const usedDrivers = [];
    for (const [key, value] of Object.entries(env_1.default)) {
        if ((key.startsWith('STORAGE') && key.endsWith('DRIVER')) === false)
            continue;
        if (value && usedDrivers.includes(value) === false)
            usedDrivers.push(value);
    }
    usedDrivers.forEach((driver) => {
        const storageDriver = getStorageDriver(driver);
        if (storageDriver) {
            storage.registerDriver(driver, storageDriver);
        }
    });
}
function getStorageDriver(driver) {
    switch (driver) {
        case 'local':
            return drive_1.LocalFileSystemStorage;
        case 's3':
            return drive_s3_1.AmazonWebServicesS3Storage;
        case 'gcs':
            return drive_gcs_1.GoogleCloudStorage;
        case 'azure':
            return drive_azure_1.AzureBlobWebServicesStorage;
    }
}
