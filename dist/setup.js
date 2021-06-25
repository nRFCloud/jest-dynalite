"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
exports.default = (withConfigDir) => {
    config_1.setConfigDir(withConfigDir);
    const port = config_1.getDynalitePort();
    // Provide environment variables before other scripts are executed
    process.env.MOCK_DYNAMODB_PORT = port.toString();
    process.env.MOCK_DYNAMODB_ENDPOINT = `http://localhost:${port}`;
};
//# sourceMappingURL=setup.js.map