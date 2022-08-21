import type { Client } from "discord.js";
import schedule from "node-schedule";
import { logger } from "~/core/logger";

import { sendTriviaQuestion, rescheduleTrivia } from "~/features/trivia";

const firstTriviaJobRule = "0 13 * * *"; // 2.00PM UTC (11PM AEST)

export function initializeScheduler(client: Client) {
  logger.info("Initializing scheduler.");

  const triviaJob = schedule.scheduleJob(firstTriviaJobRule, () => {
    client.guilds.cache.forEach((guild) => sendTriviaQuestion(guild));
  });

  logger.info("Initial trivia job configured.", {
    nextInvocation: triviaJob.nextInvocation()
  });

  schedule.scheduleJob("1 23 * * *", () => {
    rescheduleTrivia(triviaJob);
  });
}
