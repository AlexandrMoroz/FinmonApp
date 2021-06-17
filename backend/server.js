const cors = require("cors");
const exp = require("express");
const passport = require("passport");
const { connect } = require("mongoose");
const winston = require("winston"),
  expressWinston = require("express-winston");
let initServer = (config) => {
  // Initialize the application
  const app = exp();
  // Middlewares
  app.use(cors());
  app.use(exp.json());
  app.use(passport.initialize());
  require("./middlewares/passport")(passport, config.SECRET);
  new winston.transports.File({ filename: "info.log", dirname: "logs",handleExceptions: true }),
  // app.use(
  //   expressWinston.logger({
  //     transports: [
  //       new winston.transports.Console({ handleExceptions: true }),
       
  //     ],
  //     exceptionHandlers: [
  //       new winston.transports.Console({ handleExceptions: true }),
  //       new winston.transports.File({
  //         filename: "exceptions.log",
  //         dirname: "logs",
  //       }),
  //     ],
  //     format: winston.format.combine(
  //       winston.format.errors({ stack: true }),
  //       winston.format.colorize(),
  //       winston.format.json()
  //     ),
  //     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  //     msg: "HTTP {{req.url}} {{req.body}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  //     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  //     colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  //     ignoreRoute: function (req, res) {
  //       return false;
  //     }, // optional: allows to skip some log messages based on request and/or response
  //   })
  // );
  // User Router Middleware
  app.use("/api/user", require("./routes/user"));
  app.use("/api/person", require("./routes/person"));
  app.use("/api/company", require("./routes/company"));
  app.use("/api/form", require("./routes/form"));
  app.use("/api/helper", require("./routes/helper"));
  app.use("/api/history", require("./routes/history"));
  process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });
  
  //   expressWinston.errorLogger({
  //      transports: [
  //       new winston.transports.Console({ handleExceptions: true }),
  //       new winston.transports.File({ filename: "error.log", dirname: "logs",handleExceptions: true }),
  //     ],
  //     exceptionHandlers: [
  //       new winston.transports.Console({ handleExceptions: true }),
  //       new winston.transports.File({
  //         filename: "exceptions.log",
  //         dirname: "logs",
  //       }),
  //     ],
  //     format: winston.format.combine(
  //       winston.format.errors({ stack: true }),
  //       winston.format.colorize(),
  //       winston.format.json()
  //     ),
  //     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  //     msg: "HTTP {{req.url}} {{req.body}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  //     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  //     colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  //     ignoreRoute: function (req, res) {
  //       return false;
  //     }, // optional: allows to skip some log messages based on request and/or response
  //   })
  // );
  const server = async () => {
    try {
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

      // Start Listenting for the server on PORT
      return app.listen(config.PORT, "0.0.0.0", () => {
        console.log(`Server started on PORT ${config.PORT}`);
      });
    } catch (err) {
      //add login
      server();
    }
  };
  server();
};

module.exports = initServer;
