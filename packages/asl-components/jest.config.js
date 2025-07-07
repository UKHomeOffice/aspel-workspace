module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!uuid|react-markdown|remark-.*|rehype-.*)/'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/setup-test.js'
    ]
};
