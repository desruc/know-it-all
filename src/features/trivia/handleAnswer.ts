import type { ButtonInteraction, Guild } from "discord.js";
import { Colors } from "discord.js";
import { logger } from "~/core/logger";
import {
  markHasAnswered,
  resetStreaks,
  updateWinner
} from "~/db/repositories/userRepository";

const triviaRoleName = "Trivia Kingpin";

const getUserId = (interaction: ButtonInteraction) => interaction.user.id;

const createTriviaRole = async (guild: Guild) => {
  const role = await guild.roles.create({
    name: triviaRoleName,
    mentionable: false,
    hoist: true,
    position: 3,
    color: Colors.LuminousVividPink
  });

  return role;
};

const grantWinnerRole = async (guild: Guild, interaction: ButtonInteraction) => {
  const allRoles = await guild.roles.fetch();

  const existingRole = allRoles.find((r) => r.name === triviaRoleName);

  if (!existingRole) {
    logger.info("The winning role does not exist on this guild. Creating it now.", {
      guild: guild.id
    });
  }

  const role = existingRole ?? (await createTriviaRole(guild));

  // Remove role from previous winner
  const guildMembers = await guild.members.fetch();

  guildMembers.forEach((m) => {
    m.roles.remove(role);
  });

  const winningMember = guildMembers.find(
    (m) => m.user.id === interaction.member?.user.id
  );

  if (winningMember) {
    logger.info("Granting role to winning member.", {
      winningMember: winningMember.id,
      role: role.name
    });

    winningMember.roles.add(role);
  } else {
    logger.info("Could not find winning member.", { guild: guild.id });
  }
};

export const onCorrectAnswer = async (
  guild: Guild,
  interaction: ButtonInteraction
) => {
  const winningUserId = getUserId(interaction);

  // Update current streak and highest streak
  const winner = await updateWinner(guild.id, winningUserId);
  // Reset everyone else current streak to zero
  await resetStreaks(winningUserId);

  interaction.reply(
    `Nicely done ${interaction.user}! Your current streak is ${winner.currentStreak}!`
  );

  grantWinnerRole(guild, interaction);
};

export const onWrongAnswer = async (
  guildId: string,
  interaction: ButtonInteraction
) => {
  await markHasAnswered(guildId, getUserId(interaction));
  interaction.reply(`Sorry, ${interaction.user}! That is incorrect.`);
};

export const onAlreadyAnswered = async (interaction: ButtonInteraction) =>
  interaction.reply({
    content: "Sorry! You can only submit one answer per day.",
    ephemeral: true
  });
