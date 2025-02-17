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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = exports.deleteTables = void 0;
const dynamodb_1 = __importStar(require("aws-sdk/clients/dynamodb"));
const utils_1 = require("../utils");
let connection;
const dbConnection = (port) => {
    if (connection) {
        return connection;
    }
    const options = {
        endpoint: `localhost:${port}`,
        sslEnabled: false,
        region: "local",
    };
    connection = {
        dynamoDB: new dynamodb_1.default(options),
        documentDB: new dynamodb_1.DocumentClient(options),
    };
    return connection;
};
const waitForTable = async (client, tableName) => {
    var _a;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        const details = await client
            .describeTable({ TableName: tableName })
            .promise()
            .catch(() => undefined);
        if (((_a = details === null || details === void 0 ? void 0 : details.Table) === null || _a === void 0 ? void 0 : _a.TableStatus) === "ACTIVE") {
            // eslint-disable-next-line no-await-in-loop
            await utils_1.sleep(10);
            break;
        }
        // eslint-disable-next-line no-await-in-loop
        await utils_1.sleep(10);
    }
};
/**
 * Poll the tables list to ensure that the given list of tables exists
 */
const waitForDeleted = async (client, tableName) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        const details = await client
            .describeTable({ TableName: tableName })
            .promise()
            .catch((e) => e.name === "ResourceInUseException");
        // eslint-disable-next-line no-await-in-loop
        await utils_1.sleep(100);
        if (!details) {
            break;
        }
    }
};
const deleteTables = (tableNames, port) => utils_1.runWithRealTimers(async () => {
    const { dynamoDB } = dbConnection(port);
    await Promise.all(tableNames.map((table) => dynamoDB
        .deleteTable({ TableName: table })
        .promise()
        .catch(() => { })));
    await Promise.all(tableNames.map((table) => waitForDeleted(dynamoDB, table)));
});
exports.deleteTables = deleteTables;
const createTables = (tables, port) => utils_1.runWithRealTimers(async () => {
    const { dynamoDB, documentDB } = dbConnection(port);
    await Promise.all(tables.map((table) => dynamoDB.createTable(utils_1.omit(table, "data")).promise()));
    await Promise.all(tables.map((table) => waitForTable(dynamoDB, table.TableName)));
    await Promise.all(tables.map((table) => table.data &&
        Promise.all(table.data.map((row) => documentDB
            .put({ TableName: table.TableName, Item: row })
            .promise()
            .catch((e) => {
            throw new Error(`Could not add ${JSON.stringify(row)} to "${table.TableName}": ${e.message}`);
        })))));
});
exports.createTables = createTables;
//# sourceMappingURL=v2.js.map