module.exports = {
    resetMocks: false,
    setupFiles: ["jest-localstorage-mock"],
    setupFilesAfterEnv: ["./jest.setup.js"],
    testEnvironment: "jest-environment-jsdom"
};