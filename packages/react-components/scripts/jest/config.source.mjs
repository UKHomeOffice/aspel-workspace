'use strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const moduleNameMapper = {
  'ho-react-components(.*)': '<rootDir>/src$1'
};

export default {
  setupFilesAfterEnv: [
    require.resolve('./setupTests.js'),
  ],
  // Only include files directly in __tests__, not in nested folders.
  rootDir: process.cwd(),
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx'],
  fakeTimers: {
    enableGlobally: true,
  },
  moduleNameMapper: moduleNameMapper,
  snapshotSerializers: [
    "jest-serializer-html",
    "enzyme-to-json/serializer"
  ],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    "^.+\\.js[x]?$": "babel-jest"
  }
};
