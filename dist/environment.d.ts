import NodeEnvironment from "jest-environment-node";
import type { Config } from "@jest/types";
declare class DynaliteEnvironment extends NodeEnvironment {
    constructor(projectConfig: Config.ProjectConfig);
    setup(): Promise<void>;
    teardown(): Promise<void>;
}
export default DynaliteEnvironment;
