import { setConfigDir, getDynalitePort } from "./config";

export default (withConfigDir: string): void => {
  setConfigDir(withConfigDir);

  const port = getDynalitePort();

  // Provide environment variables before other scripts are executed
  process.env.MOCK_DYNAMODB_PORT = port.toString();
  process.env.MOCK_DYNAMODB_ENDPOINT = `http://localhost:${port}`;
};
