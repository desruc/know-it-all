import "dotenv/config";
import { initializeBot } from "~/core/bot";
import { logger } from "~/core/logger";

initializeBot();

process.on("unhandledRejection", (error) => {
  logger.error("UNHANDLED_REJECTION: ", { error });
});

process.on("uncaughtException", (error) => {
  logger.warn("NODE_WARN: ", {
    stack: "Uncaught Exception detected. Restarting..."
  });
  logger.error("UNCAUGHT_EXCEPTION: ", {
    message: error.message,
    stack: error.stack
  });
});
