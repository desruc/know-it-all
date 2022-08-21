import type { Client, ClientEvents } from "discord.js";

export interface DiscordEvent {
  name: keyof ClientEvents;
  exec(client: Client, ...args: any): Promise<void>;
}
