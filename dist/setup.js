"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
exports.default = (withConfigDir) => {
    config_1.setConfigDir(withConfigDir);
    const port = config_1.getDynalitePort();
    // Provide environment variables before other scripts are executed
    process.env.MOCK_DYNAMODB_PORT = port.toString();
    process.env.MOCK_DYNAMODB_ENDPOINT = `http://localhost:${port}`;
    if (process.env.AWS_PROFILE == null && process.env.AWS_ACCESS_KEY_ID == null && process.env.AWS_SECRET_ACCESS_KEY == null) {
        process.env.AWS_ACCESS_KEY_ID = 'coolkey';
        process.env.AWS_SECRET_ACCESS_KEY = 'secert';
    }
};
//# sourceMappingURL=setup.js.map