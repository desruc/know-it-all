import type { Client } from "discord.js";
import { ActivityType } from "discord.js";
import { logger } from "~/core/logger";
import { initializeScheduler } from "~/schedule";
import { DiscordEvent } from "~/types";

function setPresence(client: Client) {
  client.user?.setPresence({
    activities: [{ name: "games with your heart", type: ActivityType.Playing }]
  });
}

async function exec(client: Client) {
  logger.info("Ready and listening!");
  setInterval(() => setPresence(client), 30 * 1000);
  setPresence(client);

  initializeScheduler(client);
}

export const ready: DiscordEvent = {
  name: "ready",
  exec
};
