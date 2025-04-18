const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: "info",
    filename: "./logs/info.log",
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  error: {
    level: "error",
    filename: "./logs/error.log",
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: "debug",
    json: false,
    colorize: true,
  },
};
const formater = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
var logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.File(options.error),
  ],
  format: combine(timestamp(), formater),
  exceptionHandlers: [
    new transports.File({
      level: "error",
      filename: "./logs/exceptions.log",
      handleExceptions: true,
      timestamp: true,
      maxsize: 1000000,
    }),
    new transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;
