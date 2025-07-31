module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest' // Use Babel to transform JS/TS files
  },
  transformIgnorePatterns: [],
  collectCoverage: true,
  coverageReporters: ["json", "html"]
};
