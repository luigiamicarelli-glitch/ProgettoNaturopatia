// Polyfill btoa/atob for jsdom environment
if (typeof btoa === "undefined") {
  global.btoa = (str) => Buffer.from(str, "binary").toString("base64");
  global.atob = (str) => Buffer.from(str, "base64").toString("binary");
}

// Polyfill fetch (replaced by jest.fn() per test when needed)
if (typeof fetch === "undefined") {
  global.fetch = jest.fn();
}
