import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";
import type {
  Client,
  CommandInteraction,
  Interaction,
  User as DiscordUser
} from "discord.js";

import { logger } from "~/core/logger";
import {
  topFiveCorrectAnswers,
  topFiveStreaks,
  topFiveTotalAnswered
} from "~/db/repositories/userRepository";
import { User } from "~/db/entities/user";
import { asyncForEach } from "~/utils/asyncForEach";

interface MappedUser extends User {
  discordUser: DiscordUser;
}

const commandName = "leaderboard";
const commandDescription = "see the leaderboard for the chosen statistic";

const statChoices = [
  { name: "streak", value: "streak" },
  { name: "correct answers", value: "correctAnswers" },
  { name: "total answers", value: "totalAnswers" }
];

type Stat = typeof statChoices[number]["value"];

const command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(commandDescription)
  .addStringOption((option) =>
    option
      .setName("stat")
      .setDescription("the statistic you want to see")
      .setRequired(true)
      .addChoices(...statChoices)
  );

const fetchUsersFromDatabase = async (guildId: string, stat: Stat) => {
  switch (stat) {
    case "streaks":
      return topFiveStreaks(guildId);
    case "correctAnswers":
      return topFiveCorrectAnswers(guildId);
    case "totalAnswers":
      return topFiveTotalAnswered(guildId);
    default:
      return topFiveStreaks(guildId);
  }
};

const getMappedUsers = async (client: Client, guildId: string, stat: Stat) => {
  const users = await fetchUsersFromDatabase(guildId, stat);

  const mapped: MappedUser[] = [];

  await asyncForEach(users, async (u) => {
    const discordUser = await client.users.fetch(u.id);
    mapped.push({ ...u, discordUser });
  });

  return mapped;
};

const titleLookup: Record<Stat, string> = {
  streak: "Users with the highest streaks",
  correctAnswers: "Users with the most correct answers",
  totalAnswers: "Users who have attempted the most questions"
};

const createEmbed = (interaction: CommandInteraction, stat: Stat) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.NotQuiteBlack)
    .setTitle(titleLookup[stat])
    .setTimestamp();

  if (interaction.guild) {
    embed.setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL() ?? undefined
    });
  }

  return embed;
};

const addTopSteaksToEmbed = async (users: MappedUser[], embed: EmbedBuilder) => {
  let description = "";

  users.forEach((u, idx) => {
    description += `${idx + 1}. ${u.discordUser.username} - **${u.highestStreak}**${
      u.currentStreak === u.highestStreak && u.highestStreak !== 0
        ? " (current)"
        : ""
    }\n`;
  });

  embed.setDescription(description);
};

const executeSlashCommand = async (client: Client, interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (!interaction.guildId) return null;

  await interaction.deferReply();

  const stat = interaction.options.getString("stat");

  if (!stat || !statChoices.some((s) => s.value === stat))
    throw Error("Invalid stat supplied");

  try {
    const users = await getMappedUsers(client, interaction.guildId, stat);

    const embed = createEmbed(interaction, stat);

    if (stat === "streak") addTopSteaksToEmbed(users, embed);

    if (embed) {
      interaction.editReply({ embeds: [embed] });
    } else {
      interaction.editReply("This command is only available within a server.");
    }
  } catch (error) {
    logger.error("There was an error fetching the leaderboard", { error, stat });
  }
};

export const leaderboardCommand = {
  definition: command,
  execute: executeSlashCommand
};
