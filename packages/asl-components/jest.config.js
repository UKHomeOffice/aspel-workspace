module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(uuid)/)'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/setup-test.js'
    ]
};
