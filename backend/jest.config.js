export default {
  testEnvironment: "node",
  transform: {},
  setupFiles: ["<rootDir>/tests/setup.mjs"],
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/tests/__mocks__/prismaMock.js"
  },
  sandboxInjectedGlobals: [],
};
