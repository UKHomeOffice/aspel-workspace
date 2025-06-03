/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom', // ← add this line
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  moduleDirectories: ['pages/common', 'node_modules', 'lib'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|react-shallow-renderer|@cfaester|@ukhomeoffice|@asl))'
  ],
  watchPathIgnorePatterns: [
    'node_modules/(?!(@ukhomeoffice|@asl))'
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer']
};
