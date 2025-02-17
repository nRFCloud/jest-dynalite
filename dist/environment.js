"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const jest_environment_node_1 = __importDefault(require("jest-environment-node"));
const setup_1 = __importDefault(require("./setup"));
const db_1 = require("./db");
const config_1 = require("./config");
class DynaliteEnvironment extends jest_environment_node_1.default {
    constructor(projectConfig) {
        // The config directory is based on the root directory
        // of the project config
        const { rootDir } = projectConfig;
        try {
            setup_1.default(rootDir);
        }
        catch (e) {
            if (e instanceof config_1.NotFoundError) {
                throw new Error(`
jest-dynalite could not find "${config_1.CONFIG_FILE_NAME}" in the jest <rootDir> (${rootDir}).

If you didn't intend to be using this directory for the config, please specify a custom
directory: https://github.com/freshollie/jest-dynalite/#advanced-setup

If you are already using a custom config directory, you should apply 'import "jest-dynalite/withDb"'
to your "setupFilesAfterEnv" instead of using the preset.

For more information, please see https://github.com/freshollie/jest-dynalite/#breaking-changes.
      `);
            }
            throw e;
        }
        super(projectConfig);
    }
    async setup() {
        await super.setup();
        await db_1.start();
    }
    async teardown() {
        await db_1.stop();
        await super.teardown();
    }
}
exports.default = DynaliteEnvironment;
module.exports = DynaliteEnvironment;
//# sourceMappingURL=environment.js.map