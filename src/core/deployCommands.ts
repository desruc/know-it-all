import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import type { Guild } from "discord.js";

import { meCommand } from "~/commands/me";
import { leaderboardCommand } from "~/commands/leaderboard/leaderboard";
import { logger } from "~/core/logger";

const { CLIENT_ID, DISCORD_TOKEN } = process.env;

const commands = [
  meCommand.definition.toJSON(),
  leaderboardCommand.definition.toJSON()
];

export const deployCommands = async (guild: Guild) => {
  try {
    if (!DISCORD_TOKEN) throw Error("DISCORD_TOKEN must be supplied");
    if (!CLIENT_ID) throw Error("CLIENT_ID must be supplied");

    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

    logger.info("Started refreshing application (/) commands.", { guild: guild.id });

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), {
      body: commands
    });

    logger.info("Successfully reloaded application (/) commands.", {
      guild: guild.id
    });
  } catch (error) {
    logger.error("Error refreshing application (/) commands for guild.", {
      guild: guild.id
    });
  }
};
