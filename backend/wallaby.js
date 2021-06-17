module.exports = function () {
   process.env.APP_DB,
   process.env.APP_PORT,
   process.env.APP_SECRET
  return {
    files: [
      "config/index.js",
      "controller/*.js",
      "models/*.js",
      "middlewares/*.js",
      "routes/*.js",
      "utils/*.js",
      "mock/*.json",
      "validation/*.js",
         //'index.js',
      "server.js",
    ],

    tests: ["test/*.js"],
    testFramework: "mocha",
    setup: function () {
      global.expect = require("chai").expect;
    },

    env: {
      type: "node",
      runner: "node",
    },
  };
};
