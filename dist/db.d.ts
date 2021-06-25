/// <reference path="../types/dynalite.d.ts" />
export declare const dynaliteInstance: import("dynalite").DynaliteServer;
export declare const start: () => Promise<void>;
export declare const stop: () => Promise<void>;
export declare const deleteTables: () => Promise<void>;
export declare const createTables: () => Promise<void>;
