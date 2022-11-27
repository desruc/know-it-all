import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";
import type { CommandInteraction, Client } from "discord.js";
import { getUser } from "~/db/repositories/userRepository";

const commandName = "me";
const commandDescription = "See your trivia stats for this server";

const command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(commandDescription);

const getEmbed = async (interaction: CommandInteraction) => {
  if (!interaction.guildId) return null;

  const userRecord = await getUser(interaction.guildId, interaction.user.id);

  const embed = new EmbedBuilder()
    .setColor(Colors.NotQuiteBlack)
    .setTitle(interaction.user.username)
    .setThumbnail(interaction.user.avatarURL())
    .setFields(
      {
        name: "Current streak",
        value: userRecord.currentStreak.toString()
      },
      {
        name: "Highest streak",
        value: userRecord.highestStreak.toString()
      },
      {
        name: "Current points",
        value: userRecord.currentPoints.toString()
      },
      {
        name: "Highest points",
        value: userRecord.highestPoints.toString()
      },
      {
        name: "Total correct answers",
        value: userRecord.totalCorrectAnswers.toString()
      },
      {
        name: "Total answers",
        value: userRecord.totalAnswers.toString()
      }
    )
    .setTimestamp();

  if (interaction.guild) {
    embed.setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL() ?? undefined
    });
  }

  return embed;
};

const executeSlashCommand = async (_: Client, interaction: CommandInteraction) => {
  await interaction.deferReply();

  const embed = await getEmbed(interaction);

  if (embed) {
    interaction.editReply({ embeds: [embed] });
  } else {
    interaction.editReply("This command is only available within a server.");
  }
};

export const meCommand = {
  definition: command,
  execute: executeSlashCommand
};
