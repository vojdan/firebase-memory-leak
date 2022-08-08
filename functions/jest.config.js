const path = require("path");

// connect to emulator
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_DATABASE_EMULATOR_HOST = "localhost:9000";
process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";

module.exports = {
  roots: [path.join(__dirname, "/src")],
  // enable imports from these directories as if they are node modules
  moduleDirectories: ["node_modules", __dirname, path.join(__dirname, "/src")],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // some nice plugins when watching tests
  watchPlugins: [
    // require.resolve('jest-watch-select-projects'),
    require.resolve("jest-watch-typeahead/filename"),
    require.resolve("jest-watch-typeahead/testname"),
  ],
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.js"],
};
