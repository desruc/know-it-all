import type { Client } from "discord.js";
import schedule from "node-schedule";
import { logger } from "~/core/logger";
import {
  sendTriviaQuestion,
  rescheduleTrivia,
  getRandomTriviaTime
} from "~/features/trivia";

export function initializeScheduler(client: Client) {
  logger.info("Initializing scheduler.", {
    guildIds: client.guilds.cache.map((g) => g.id)
  });

  const triviaJob = schedule.scheduleJob(getRandomTriviaTime(), () => {
    client.guilds.cache.forEach((guild) => {
      logger.info("Sending question to guild.", { guild: guild.id });

      sendTriviaQuestion(guild).catch((error) => {
        logger.error("There was an error sending the trivia question.", {
          error,
          guild: guild.id
        });
      });
    });
  });

  logger.info("Initial trivia job configured.", {
    nextInvocation: triviaJob.nextInvocation()
  });

  const reschedulingJob = schedule.scheduleJob("59 23 * * *", (date) => {
    logger.info("Rescheduling trivia job.", { date });

    rescheduleTrivia(triviaJob);
  });

  logger.info("Trivia rescheduling job configured.", {
    nextInvocation: reschedulingJob.nextInvocation()
  });
}
