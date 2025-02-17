"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.killConnection = exports.createTables = exports.deleteTables = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dynamodb_auto_marshaller_1 = require("@aws/dynamodb-auto-marshaller");
const utils_1 = require("../utils");
let connection;
const dbConnection = (port) => {
    if (connection) {
        return connection;
    }
    const options = {
        endpoint: `http://localhost:${port}`,
        sslEnabled: false,
        region: "local",
    };
    connection = {
        dynamoDB: new client_dynamodb_1.DynamoDB(options),
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
    await Promise.all(tableNames.map((table) => dynamoDB.deleteTable({ TableName: table }).catch(() => { })));
    await Promise.all(tableNames.map((table) => waitForDeleted(dynamoDB, table)));
});
exports.deleteTables = deleteTables;
const createTables = (tables, port) => utils_1.runWithRealTimers(async () => {
    const { dynamoDB } = dbConnection(port);
    await Promise.all(tables.map((table) => dynamoDB.createTable(utils_1.omit(table, "data"))));
    await Promise.all(tables.map((table) => waitForTable(dynamoDB, table.TableName)));
    await Promise.all(tables.map((table) => table.data &&
        Promise.all(table.data.map((row) => dynamoDB
            .putItem({
            TableName: table.TableName,
            Item: new dynamodb_auto_marshaller_1.Marshaller().marshallItem(row),
        })
            .catch((e) => {
            throw new Error(`Could not add ${JSON.stringify(row)} to "${table.TableName}": ${e.message}`);
        })))));
});
exports.createTables = createTables;
const killConnection = () => {
    connection === null || connection === void 0 ? void 0 : connection.dynamoDB.destroy();
};
exports.killConnection = killConnection;
//# sourceMappingURL=v3.js.map