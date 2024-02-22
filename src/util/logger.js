const { createLogger, transports, format } = require("winston");
const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "app.log"})
    ]
});

process.on("uncaughtException", err => {
    logger.error(`Uncaught Exception: ${err}`);
    process.exit(1);
});

module.exports = logger;