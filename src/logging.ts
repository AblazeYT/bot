import { createLogger, format, transports } from "winston";

export const logger = createLogger({
    level: "debug",
    format: format.json(),
    transports: [
        process.env.NODE_ENV !== "production" ? new transports.Console({ format: format.simple() }) : new transports.File({ filename: "error.log", level: "error" }),
    ],
});
export const whatsappLogger = createLogger({
    level: "debug",
    format: format.json(),
    defaultMeta: { service: "whatsapp" },
    transports: [
        process.env.NODE_ENV !== "production" ? new transports.Console({ format: format.simple() }) : new transports.File({ filename: "error.log", level: "error" }),
    ],
});
export const discordLogger = createLogger({
    level: "info",
    format: format.json(),
    defaultMeta: { service: "discord" },
    transports: [
        process.env.NODE_ENV !== "production" ? new transports.Console({ format: format.simple() }) : new transports.File({ filename: "error.log", level: "error" }),
    ],
});