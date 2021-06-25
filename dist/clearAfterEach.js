"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
afterEach(async () => {
    await db_1.deleteTables();
    await db_1.createTables();
});
//# sourceMappingURL=clearAfterEach.js.map