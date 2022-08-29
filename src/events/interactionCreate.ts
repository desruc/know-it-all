import type { Client, Interaction } from "discord.js";
import { leaderboardCommand } from "~/commands/leaderboard";
import { meCommand } from "~/commands/me";
import { logger } from "~/core/logger";
import type { DiscordEvent } from "~/types";

const slashCommands = [meCommand, leaderboardCommand];

async function exec(client: Client, interaction: Interaction) {
  if (!interaction.isCommand()) return;

  const command = slashCommands.find(
    (c) => c.definition.name === interaction.commandName
  );

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (error) {
    logger.error("There was an error executing the command", { error });

    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true
    });
  }
}

export const interactionCreate: DiscordEvent = {
  name: "interactionCreate",
  exec
};
