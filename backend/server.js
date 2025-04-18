const cors = require("cors");
const exp = require("express");
const passport = require("passport");
const { connect } = require("mongoose");
let winston = require("./config/winston");
const helmet = require("helmet");

// var morgan = require("morgan");
let initServer = (config) => {
  console.log("init serv config");
  // Initialize the application
  const app = exp();
  app.disable("x-powered-by");
  app.use(helmet());

  // Middlewares
  app.use(cors());
  app.use(exp.json());
  app.use(passport.initialize());
  require("./middlewares/passport")(passport, config.SECRET);
  //morgan.token("custom", "RESPONSE: :method;  url::url => :status ");
  //app.use(morgan("custom", { stream: winston.stream }));
  app.use((req, res, next) => {
    winston.info(
      `REQUEST: ${req.method}; url:${req.url} - ${
        req.method == "POST"
          ? JSON.stringify(req.body)
          : JSON.stringify(req.query)
      }`
    );
    next();
  });

  // Router Middleware
  app.use("/api/user", require("./routes/user"));
  app.use("/api/company", require("./routes/company"));
  app.use("/api/form", require("./routes/form"));
  app.use("/api/helper", require("./routes/helper"));
  app.use("/api/history", require("./routes/history"));
  app.use("/api/person", require("./routes/person"));
  app.use("/api/externalbase", require("./routes/externalbase"));
  process.on("unhandledRejection", function (reason, p) {
    // console.log("Caught exception: " + reason);
    // console.log(reason)
    winston.error(reason.stack);
    process.exit(1);
  });

  process.on("uncaughtException", function (err, origin) {
    // console.log("Caught exception: " + err);
    // console.log(err);
    winston.error(err.stack);
    process.exit(1);
  });

  app.use((err, req, res, next) => {
    winston.error(
      `REQUEST: ${req.method}; url:${req.url} - ${
        req.method == "POST"
          ? JSON.stringify(req.body)
          : JSON.stringify(req.query)
      } ErrorMessage: ${err.stack}`
    );
    res.status(err.status || 500).json({
      message: err.message,
      error: req.app.get("env") === "development" ? err : {},
      success: false,
    });
    next();
  });

  connect(config.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log({
    message: `Successfully connected with the Database \n${config.DB}`,
    badge: true,
  });

  return app.listen(config.PORT, "0.0.0.0", () => {
    console.log(`Server started on PORT ${config.PORT}`);
  });
};

module.exports = initServer;
