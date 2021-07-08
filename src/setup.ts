import { setConfigDir, getDynalitePort } from "./config";

export default (withConfigDir: string): void => {
  setConfigDir(withConfigDir);

  const port = getDynalitePort();

  // Provide environment variables before other scripts are executed
  process.env.MOCK_DYNAMODB_PORT = port.toString();
  process.env.MOCK_DYNAMODB_ENDPOINT = `http://localhost:${port}`;

  if (process.env.AWS_PROFILE == null && process.env.AWS_ACCESS_KEY_ID == null && process.env.AWS_SECRET_ACCESS_KEY == null) {
    process.env.AWS_ACCESS_KEY_ID = 'coolkey';
    process.env.AWS_SECRET_ACCESS_KEY = 'secert';
  }
};
