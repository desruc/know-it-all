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

// Docker container default timezone is UTC
const triviaTimes = [
  "1 7 * * *", // 5:00pm AEST
  "30 7 * * *", // 5:30pm AEST
  "1 8 * * *", // 6:00pm AEST
  "30 8 * * *", // 6:30pm AEST
  "1 9 * * *", // 7:00pm AEST
  "30 9 * * *", // 7:30pm AEST
  "1 10 * * *", // 8:00pm AEST
  "30 10 * * *", // 8:30pm AEST
  "1 11 * * *", // 9:00pm AEST
  "30 11 * * *" // 9:30pm AEST
];

const getTriviaTime = () => {
  const rand = randomNumber(0, triviaTimes.length - 1);
  return triviaTimes[rand];
};

export const rescheduleTrivia = (job: ScheduledJob) => {
  const nextTime = getTriviaTime();
  job.reschedule(nextTime);
  logger.info(`The next trivia question will be sent on ${job.nextInvocation()}`);

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
