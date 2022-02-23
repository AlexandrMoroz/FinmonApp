const { testConfig } = require("../config/index");
let server = require("../server")(testConfig);

require("./user")(server);
require("./company")(server);
require("./person")(server);
require("./form")(server);
require("./helper")(server);
require("./history")(server);
require("./questions")(server);
// // require("./sanction")(server);
// // require("./terrorist")(server);
require("./clienlist")(server);
