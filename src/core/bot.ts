import { Client, IntentsBitField } from "discord.js";
import { ready } from "~/events/ready";
import type { DiscordEvent } from "~/types";
import { db } from "~/db";
import { logger } from "~/core/logger";
import { interactionCreate } from "~/events/interactionCreate";

const client = new Client({
  partials: [],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers
  ]
});

const events: DiscordEvent[] = [ready, interactionCreate];

function initializeEvents() {
  events.forEach((e) => {
    client.on(e.name, async (...args) => {
      await e.exec(client, ...args);
    });
  });
}

export async function initializeBot() {
  try {
    await db.initialize();
    logger.info("Successfully connected to database.");
  } catch (error) {
    logger.error("Error connecting to database.", { error });
  }

  initializeEvents();

  await client.login(process.env.DISCORD_TOKEN);
}
