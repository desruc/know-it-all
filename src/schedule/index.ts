import type { Client } from "discord.js";
import schedule from "node-schedule";
import { logger } from "~/core/logger";

import { sendTriviaQuestion, rescheduleTrivia } from "~/features/trivia";

const firstTriviaJobRule = "30 10 * * *"; // 10.30AM UTC (8.30PM AEST)

export function initializeScheduler(client: Client) {
  logger.info("Initializing scheduler.");

  const triviaJob = schedule.scheduleJob(firstTriviaJobRule, (date) => {
    logger.info("Initial trivia job configured.", { date });
    client.guilds.cache.forEach((guild) => sendTriviaQuestion(guild));
  });

  schedule.scheduleJob("1 23 * * *", () => {
    rescheduleTrivia(triviaJob);
  });
}
