var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/shims/quais-shim.js
var pollFor = async function(provider, methodName, params, initialPollingInterval, requestTimeout, max_duration_seconds = 180, max_polling_interval = 1e4) {
  const MAX_DURATION = max_duration_seconds * 1e3;
  const MAX_POLLING_INTERVAL = Math.max(max_polling_interval, 1e4);
  let pollingInterval = initialPollingInterval;
  let startTime = Date.now();
  let poll_count = 0;
  function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Promise timeout"));
      }, ms);
      promise.then((value) => {
        clearTimeout(timer);
        resolve(value);
      }).catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
    });
  }
  if (typeof provider[methodName] !== "function") {
    throw new Error(`Invalid method: ${methodName}`);
  }
  if (provider[methodName].length !== params.length) {
    throw new Error("Incorrect number of arguments provided.");
  }
  while (true) {
    if (Date.now() - startTime > MAX_DURATION) {
      throw new Error("Maximum polling duration exceeded. Giving up.");
    }
    try {
      let methodResult = provider[methodName](...params);
      if (methodResult instanceof Promise) {
        methodResult = await withTimeout(methodResult, requestTimeout);
      }
      if (methodResult != null) {
        return methodResult;
      }
    } catch (error) {
      if (error.message === "Promise timeout") {
        console.log("Request timed out. Retrying...");
      } else {
        console.error(`An error occurred: ${error.message}. Retrying...`);
      }
    }
    poll_count += 1;
    if (poll_count % 5 == 0) {
      pollingInterval = Math.min(2e3 + pollingInterval, MAX_POLLING_INTERVAL);
    }
    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
  }
};

// src/index.js
var src_default = pollFor;
