/** @type {import('jest').Config} */
module.exports = {
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  moduleDirectories: ['pages/common', 'node_modules', 'lib'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-shallow-renderer|@cfaester|@ukhomeoffice|@asl))'
  ],
  watchPathIgnorePatterns: [
    'node_modules/(?!(@ukhomeoffice|@asl))'
  ],
  setupFilesAfterEnv: ['<rootDir>/enzyme.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer']
};
