export default {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js",
    "!src/index.js",
  ],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 10000,
  verbose: true,
};
