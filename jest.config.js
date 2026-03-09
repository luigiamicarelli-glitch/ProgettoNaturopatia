module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.js"],
  coverageDirectory: "coverage",
  testMatch: ["**/__tests__/**/*.test.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
};
