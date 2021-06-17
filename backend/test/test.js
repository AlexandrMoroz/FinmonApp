const server = require("../server");

// Bring in the app constants
const { testConfig } = require("../config/index");
server({ ...testConfig });
// require("./user")();
// require("./company")();
require("./person")();
// require("./form")();
// require("./helper")();
// require("./history")();
