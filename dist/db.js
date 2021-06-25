"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = exports.deleteTables = exports.stop = exports.start = exports.dynaliteInstance = void 0;
const dynalite_1 = __importDefault(require("dynalite"));
const config_1 = require("./config");
const utils_1 = require("./utils");
exports.dynaliteInstance = dynalite_1.default({
    createTableMs: 0,
    deleteTableMs: 0,
    updateTableMs: 0,
});
const start = async () => {
    if (!exports.dynaliteInstance.listening) {
        await new Promise((resolve) => exports.dynaliteInstance.listen(process.env.MOCK_DYNAMODB_PORT, resolve));
    }
};
exports.start = start;
const stop = async () => {
    if (utils_1.hasV3()) {
        // v3 does something to prevent dynalite
        // from shutting down until we have
        // killed the dynamodb connection
        (await Promise.resolve().then(() => __importStar(require("./dynamodb/v3")))).killConnection();
    }
    if (exports.dynaliteInstance.listening) {
        await new Promise((resolve) => exports.dynaliteInstance.close(() => resolve()));
    }
};
exports.stop = stop;
const deleteTables = async () => {
    const tablesNames = (await config_1.getTables()).map((table) => table.TableName);
    if (utils_1.hasV3()) {
        await (await Promise.resolve().then(() => __importStar(require("./dynamodb/v3")))).deleteTables(tablesNames, config_1.getDynalitePort());
    }
    else {
        await (await Promise.resolve().then(() => __importStar(require("./dynamodb/v2")))).deleteTables(tablesNames, config_1.getDynalitePort());
    }
};
exports.deleteTables = deleteTables;
const createTables = async () => {
    const tables = await config_1.getTables();
    if (utils_1.hasV3()) {
        await (await Promise.resolve().then(() => __importStar(require("./dynamodb/v3")))).createTables(tables, config_1.getDynalitePort());
    }
    else {
        await (await Promise.resolve().then(() => __importStar(require("./dynamodb/v2")))).createTables(tables, config_1.getDynalitePort());
    }
};
exports.createTables = createTables;
//# sourceMappingURL=db.js.map