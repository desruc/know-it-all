import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors
} from "discord.js";

export const getInitialComponentRow = (answers: string[]) => {
  const buttons = answers.map((a) =>
    new ButtonBuilder().setCustomId(a).setLabel(a).setStyle(ButtonStyle.Primary)
  );

  return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
};

export const createTriviaEmbed = (question: string): EmbedBuilder => {
  const embed = new EmbedBuilder().setColor(Colors.LuminousVividPink);

  embed.setTitle(decodeURIComponent(question));

  return embed;
};

export const getCompletedAnswerRow = (answers: string[], correctAnswer: string) => {
  const buttons = answers.map((a) =>
    new ButtonBuilder()
      .setCustomId(a)
      .setLabel(a)
      .setDisabled(true)
      .setStyle(a === correctAnswer ? ButtonStyle.Success : ButtonStyle.Danger)
  );

  return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
};
