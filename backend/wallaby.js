module.exports = function () {
  process.env.TEST_APP_DB = "mongodb://localhost:27017/node-test";
  process.env.TEST_APP_PORT = 4000;
  process.env.APP_SECRET = "123qwe123";
  return {
    debug: true,
    files: [
      "config/*.js",
      "controller/*.js",
      "models/*/*.js",
      "models/*.js",
      "middlewares/*.js",
      "routes/*.js",
      "utils/*.js",
      "mock/*.json",
      "validation/*.js",
      "index.js",
      "test/test.js",
      "server.js",
    ],

    tests: [
      "test/questions.js",
      //  "test/company.js"
    ],
    testFramework: "mocha",
    setup: function () {
      global.should = require("chai").should;
      var mocha = wallaby.testFramework;
      // mocha.suite.beforeAll(() =>
      //   require(wallaby.projectCacheDir + "/test/test.js")
      // );
    },
    env: {
      type: "node",
      runner: "node",
    },
    //runMode: "onsave",
    workers: {
      initial: 4,
      regular: 4,
      //recycle: true
    },
  };
};
