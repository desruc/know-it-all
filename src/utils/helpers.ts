import type { TextChannel, Guild, Collection } from "discord.js";
import { logger } from "~/core/logger";

export const randomNumber = (min: number, max: number): number => {
  const strictMin: number = Math.ceil(Number(min));
  const strictMax: number = Math.floor(Number(max));
  return Math.floor(Math.random() * (strictMax - strictMin + 1)) + strictMin;
};

export const getTextChannel = async (
  guild: Guild,
  channelName = ""
): Promise<TextChannel> => {
  const allChannels = await guild.channels.fetch();
  const textChannels = allChannels.filter(
    (c) => c.isTextBased() && !c.isThread() && c.type === 0
  ) as Collection<string, TextChannel>;

  logger.info("text channels", { textChannels });

  // There HAS to be one text-channel in a server
  const baseChannel = textChannels.first()!;

  if (channelName.trim().length === 0) return baseChannel;

  const channel = textChannels.find((c) => c.name === channelName);

  if (channel) return channel;
  return baseChannel;
};

export const shuffleArray = <T>(array: T[]) => {
  const temp = [...array];
  for (let i = temp.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
};
