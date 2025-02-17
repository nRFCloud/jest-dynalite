"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.hasV3 = exports.runWithRealTimers = exports.omit = exports.isFunction = exports.isPromise = void 0;
const isPromise = (p) => !!p && Object.prototype.toString.call(p) === "[object Promise]";
exports.isPromise = isPromise;
const isFunction = (f) => !!f && typeof f === "function";
exports.isFunction = isFunction;
const convertToNumbers = (keys, value) => {
    if (!Number.isNaN(Number(value)) && keys.some((v) => v === Number(value))) {
        return Number(value);
    }
    return value;
};
// credit: https://stackoverflow.com/a/62362002/1741602
const omit = (obj, ...keys) => {
    return Object.getOwnPropertySymbols(obj)
        .concat(Object.keys(obj).map((key) => convertToNumbers(keys, key)))
        .filter((key) => !keys.includes(key))
        .reduce((agg, key) => (Object.assign(Object.assign({}, agg), { [key]: obj[key] })), {});
};
exports.omit = omit;
const globalObj = (typeof window === "undefined" ? global : window);
const detectTimers = () => {
    const usingJestAndTimers = typeof jest !== "undefined" && typeof globalObj.setTimeout !== "undefined";
    const usingLegacyJestFakeTimers = usingJestAndTimers &&
        // eslint-disable-next-line no-underscore-dangle
        typeof globalObj.setTimeout._isMockFunction !== "undefined" &&
        // eslint-disable-next-line no-underscore-dangle
        globalObj.setTimeout._isMockFunction;
    let usingModernJestFakeTimers = false;
    if (usingJestAndTimers &&
        typeof globalObj.setTimeout.clock !== "undefined" &&
        typeof jest.getRealSystemTime !== "undefined") {
        try {
            // jest.getRealSystemTime is only supported for Jest's `modern` fake timers and otherwise throws
            jest.getRealSystemTime();
            usingModernJestFakeTimers = true;
        }
        catch (_a) {
            // not using Jest's modern fake timers
        }
    }
    return {
        legacy: usingLegacyJestFakeTimers,
        modern: usingModernJestFakeTimers,
    };
};
// stolen from https://github.com/testing-library/dom-testing-library/blob/master/src/helpers.js
const runWithRealTimers = (callback) => {
    const { modern, legacy } = detectTimers();
    const usingJestFakeTimers = modern || legacy;
    if (usingJestFakeTimers) {
        jest.useRealTimers();
    }
    const callbackReturnValue = callback();
    if (exports.isPromise(callbackReturnValue)) {
        return callbackReturnValue.then((value) => {
            if (usingJestFakeTimers) {
                jest.useFakeTimers(modern ? "modern" : "legacy");
            }
            return value;
        });
    }
    if (usingJestFakeTimers) {
        jest.useFakeTimers(modern ? "modern" : "legacy");
    }
    return callbackReturnValue;
};
exports.runWithRealTimers = runWithRealTimers;
const hasV3 = () => {
    try {
        // eslint-disable-next-line global-require
        require("@aws-sdk/client-dynamodb");
        return true;
    }
    catch (_) {
        return false;
    }
};
exports.hasV3 = hasV3;
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map