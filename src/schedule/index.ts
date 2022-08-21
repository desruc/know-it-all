import type { Client } from "discord.js";
import schedule from "node-schedule";
import { logger } from "~/core/logger";

import { sendTriviaQuestion, rescheduleTrivia } from "~/features/trivia";

const firstTriviaJobRule = "0 11 * * *"; // 11AM UTC (9PM AEST)

export function initializeScheduler(client: Client) {
  logger.info("Initializing scheduler.", {
    guildIds: client.guilds.cache.map((g) => g.id)
  });

  const triviaJob = schedule.scheduleJob(firstTriviaJobRule, () => {
    logger.info("Sending trivia question.", { firstTriviaJobRule });

    client.guilds.cache.forEach((guild) => {
      logger.info("Sending question to guild.", { guild: guild.id });

      sendTriviaQuestion(guild).catch((error) =>
        logger.error("There was an error sending the trivia question.", {
          error,
          guild: guild.id
        })
      );
    });
  });

  logger.info("Initial trivia job configured.", {
    nextInvocation: triviaJob.nextInvocation()
  });

  schedule.scheduleJob("59 23 * * *", () => {
    rescheduleTrivia(triviaJob);
  });
}
