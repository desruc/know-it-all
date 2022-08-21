import "dotenv/config";
import { initializeBot } from "~/core/bot";
import { logger } from "~/core/logger";

initializeBot();

process.on("unhandledRejection", (error) => {
  logger.error("UNHANDLED_REJECTION: ", { error });
});

process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT_EXCEPTION: ", { error });
  logger.warn("NODE_WARN: ", {
    stack: "Uncaught Exception detected. Restarting..."
  });
});
