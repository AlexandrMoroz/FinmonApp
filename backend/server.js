const cors = require("cors");
const exp = require("express");
const passport = require("passport");
const { connect } = require("mongoose");
var winston = require("./config/winston");
var morgan = require("morgan");
let initServer = (config) => {
  // Initialize the application
  const app = exp();

  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }
  // Middlewares
  app.use(cors());
  app.use(exp.json());
  app.use(passport.initialize());
  require("./middlewares/passport")(passport, config.SECRET);
  morgan.token("custom", "RESPONSE: :method;  url::url => :status ");
  app.use(morgan("custom", { stream: winston.stream }));
  app.use((req, res, next) => {
    winston.info(
      `REQUEST: ${req.method}; url:${req.url} - ${
        !isEmpty(req.body)
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
  process.on("unhandledRejection", function (reason, p) {
    throw new Error(reason);
  });

  // process.on('uncaughtException', function(err) {
  //   console.log('Caught exception: ' + err);
  // });
  const server = async () => {
    // Connection With DB
    await connect(config.DB, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    // console.log({
    //   message: `Successfully connected with the Database \n${config.DB}`,
    //   badge: true,
    // });
    app.use((err, req, res, next) => {
      console.log(err);
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};
      // add this line to include winston logging

      // render the error page
      res.status(err.status || 500);
      res.render("error");
      next();
    });
    // Start Listenting for the server on PORT
    return app.listen(config.PORT, "0.0.0.0", () => {
      console.log(`Server started on PORT ${config.PORT}`);
    });
  };
  server();
};

module.exports = initServer;
