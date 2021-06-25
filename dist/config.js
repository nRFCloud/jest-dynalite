"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTables = exports.getDynalitePort = exports.setConfigDir = exports.NotFoundError = exports.CONFIG_FILE_NAME = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const utils_1 = require("./utils");
exports.CONFIG_FILE_NAME = "jest-dynalite-config.js";
class NotFoundError extends Error {
    constructor(dir) {
        super(`Could not find '${exports.CONFIG_FILE_NAME}' in dir ${dir}`);
    }
}
exports.NotFoundError = NotFoundError;
let configDir = process.env.JEST_DYNALITE_CONFIG_DIRECTORY || process.cwd();
const readConfig = () => {
    const configFile = path_1.resolve(configDir, exports.CONFIG_FILE_NAME);
    if (fs_1.default.existsSync(configFile)) {
        try {
            return require(configFile); // eslint-disable-line import/no-dynamic-require, global-require
        }
        catch (e) {
            throw new Error(`Something went wrong reading your ${exports.CONFIG_FILE_NAME}: ${e.message}`);
        }
    }
    throw new NotFoundError(path_1.resolve(configDir));
};
const setConfigDir = (directory) => {
    const configFile = path_1.resolve(directory, exports.CONFIG_FILE_NAME);
    if (!fs_1.default.existsSync(configFile)) {
        throw new NotFoundError(path_1.resolve(configDir));
    }
    process.env.JEST_DYNALITE_CONFIG_DIRECTORY = directory;
    configDir = directory;
};
exports.setConfigDir = setConfigDir;
const getDynalitePort = () => {
    var _a;
    const config = readConfig();
    return (((_a = config.basePort) !== null && _a !== void 0 ? _a : 8000) +
        parseInt(process.env.JEST_WORKER_ID, 10));
};
exports.getDynalitePort = getDynalitePort;
// Cache the tables result from the config function, so that we
// are not calling it over and over
let tablesCache;
const getTables = async () => {
    if (tablesCache) {
        return tablesCache;
    }
    const tablesConfig = readConfig().tables;
    if (utils_1.isFunction(tablesConfig)) {
        tablesCache = await tablesConfig();
    }
    else {
        tablesCache = tablesConfig !== null && tablesConfig !== void 0 ? tablesConfig : [];
    }
    if (!Array.isArray(tablesCache)) {
        throw new Error("jest-dynalite requires that the tables configuration is an array");
    }
    return tablesCache;
};
exports.getTables = getTables;
//# sourceMappingURL=config.js.map