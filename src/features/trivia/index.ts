import { ComponentType, Guild } from "discord.js";
import { Job as ScheduledJob } from "node-schedule";
import { logger } from "~/core/logger";
import { randomNumber, getTextChannel } from "~/utils/helpers";
import { hasUserAnswered, resetAnswered } from "~/db/repositories/userRepository";
import { getQuestionData } from "./getQuestionData";
import { onAlreadyAnswered, onCorrectAnswer, onWrongAnswer } from "./handleAnswer";
import {
  createTriviaEmbed,
  getCompletedAnswerRow,
  getInitialComponentRow
} from "./questionEmbed";

// Get a random time between 5pm and 11PM AEST
export const getRandomTriviaTime = () => {
  return `${randomNumber(0, 57)} ${randomNumber(7, 12)} * * *`;
};

export const rescheduleTrivia = (job: ScheduledJob) => {
  const nextTime = getRandomTriviaTime();

  job.reschedule(nextTime);

  logger.info("Trivia job has been rescheduled", {
    nextInvocation: job.nextInvocation()
  });

  // Allow all users to answer the next question
  resetAnswered();
};

export async function sendTriviaQuestion(guild: Guild) {
  const channel = await getTextChannel(guild);

  const { question, answer, allAnswers } = await getQuestionData();

  const message = await channel.send({
    embeds: [createTriviaEmbed(question)],
    components: [getInitialComponentRow(allAnswers)]
  });

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 1800000
  });

  const winnerStopReason = "winner";

  collector.on("collect", async (interaction) => {
    const hasAnswered = await hasUserAnswered(guild.id, interaction.user.id);

    if (hasAnswered) {
      onAlreadyAnswered(interaction);
    } else if (interaction.customId === answer) {
      collector.stop(winnerStopReason);
      message.edit({ components: [getCompletedAnswerRow(allAnswers, answer)] });
      await onCorrectAnswer(guild, interaction);
    } else {
      await onWrongAnswer(guild.id, interaction);
    }
  });

  collector.on("end", (_, reason) => {
    if (reason !== winnerStopReason) {
      message.edit({
        content: "**Times up!** It seems no one knew the answer.",
        components: [getCompletedAnswerRow(allAnswers, answer)]
      });
    }
  });
}
