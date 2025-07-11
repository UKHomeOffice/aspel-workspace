
module.exports = {
  projects: [
    {
      displayName: 'asl-components',
      testMatch: ['<rootDir>/packages/asl-components/**/*.{test,spec}.{js,jsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/packages/asl-components/enzyme.setup.js'],
      moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
      }
    },
    {
      displayName: 'asl-projects',
      testMatch: ['<rootDir>/packages/asl-projects/**/*.{test,spec}.{js,jsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/packages/asl-projects/test/setup.js'],
      moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
      }
    },
    {
      displayName: 'backend-services',
      testMatch: [
        '<rootDir>/packages/asl-schema/**/*.{test,spec}.js',
        '<rootDir>/packages/asl-resolver/**/*.{test,spec}.js',
        '<rootDir>/packages/asl-workflow/**/*.{test,spec}.js'
      ],
      testEnvironment: 'node'
    }
  ],
  collectCoverageFrom: [
    'packages/*/lib/**/*.js',
    'packages/*/src/**/*.{js,jsx}',
    '!packages/*/node_modules/**',
    '!packages/*/test/**',
    '!packages/*/coverage/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};
