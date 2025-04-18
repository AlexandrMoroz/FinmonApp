require("dotenv").config();

module.exports.devConfig = {
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  SECRET: process.env.APP_SECRET
};

module.exports.testConfig = {
  DB: process.env.TEST_APP_DB,
  PORT: process.env.TEST_APP_PORT,
  SECRET: process.env.APP_SECRET
};
