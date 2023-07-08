const winston = require("winston");

// Winston logger
const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "e2e" },
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.info("Hello, Winston!");
logger.warn("Warning: Something may be wrong.");
logger.error("An error occurred.");

module.exports = {
  logger,
};
