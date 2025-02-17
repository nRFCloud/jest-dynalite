import { TableConfig } from "./types";
export declare const CONFIG_FILE_NAME = "jest-dynalite-config.js";
export declare class NotFoundError extends Error {
    constructor(dir: string);
}
export declare const setConfigDir: (directory: string) => void;
export declare const getDynalitePort: () => number;
export declare const getTables: () => Promise<TableConfig[]>;
