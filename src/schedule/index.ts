import type { Client } from "discord.js";
import schedule from "node-schedule";
import { logger } from "~/core/logger";

import { sendTriviaQuestion, rescheduleTrivia } from "~/features/trivia";

export function initializeScheduler(client: Client) {
  logger.info("Initializing scheduler.");

  const triviaJob = schedule.scheduleJob("30 19 * * *", () => {
    client.guilds.cache.forEach((guild) => sendTriviaQuestion(guild));
  });

  schedule.scheduleJob("1 23 * * *", () => {
    rescheduleTrivia(triviaJob);
  });
}
