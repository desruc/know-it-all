import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

import { meCommand } from "~/commands/me";

const { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } = process.env;

if (!DISCORD_TOKEN) throw Error("DISCORD_TOKEN must be supplied");
if (!CLIENT_ID) throw Error("CLIENT_ID must be supplied");
if (!GUILD_ID) throw Error("GUILD_ID must be supplied");

const commands = [meCommand.definition.toJSON()];

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
