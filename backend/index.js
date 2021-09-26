let server = require("./server");
// Bring in the app constants
const { devConfig } = require("./config/index");

server(devConfig);
