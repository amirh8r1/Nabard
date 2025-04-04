const path = require("path");

const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const ServerLogger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "http" : "debug",
  format: winston.format.combine(
    winston.format.label(),
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.ms()
  ),
  transports: [
    new DailyRotateFile({
      level: "error",
      frequency:
        process.env.LOG_FREQUENCY === "null" ? null : process.env.LOG_FREQUENCY,
      filename: "error-%DATE%.log",
      dirname: path.resolve(process.env.LOG_STORAGE_PATH),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: process.env.LOG_ZIPPED_ARCHIVE === "true",
      maxSize:
        process.env.LOG_MAX_SIZE === "null" ? null : process.env.LOG_MAX_SIZE,
      maxFiles:
        process.env.LOG_MAX_FILES === "null" ? null : process.env.LOG_MAX_FILES,
    }),
    new DailyRotateFile({
      frequency:
        process.env.LOG_FREQUENCY === "null" ? null : process.env.LOG_FREQUENCY,
      filename: "combined-%DATE%.log",
      dirname: path.resolve(process.env.LOG_STORAGE_PATH),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: process.env.LOG_ZIPPED_ARCHIVE === "true",
      maxSize:
        process.env.LOG_MAX_SIZE === "null" ? null : process.env.LOG_MAX_SIZE,
      maxFiles:
        process.env.LOG_MAX_FILES === "null" ? null : process.env.LOG_MAX_FILES,
    }),
  ],
});

ServerLogger.add(
  new winston.transports.Console({
    level: process.env.NODE_ENV === "production" ? "http" : "debug",
    format: winston.format.combine(
      winston.format.label(),
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.ms()
    ),
  })
);

ServerLogger.debug("Winston configured successfully.");

module.exports = ServerLogger;
