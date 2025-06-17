/** @type {import('jest').Config} */
module.exports = {
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  moduleDirectories: ['pages/common', 'node_modules', 'lib'],
  watchPathIgnorePatterns: [
    'node_modules/(?!(@ukhomeoffice|@asl))'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@ukhomeoffice|@asl|remark-flexible-markers|uni))'
  ],
  setupFilesAfterEnv: ['<rootDir>/enzyme.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer']
};
