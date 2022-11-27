import { db } from "~/db";
import { User } from "~/db/entities/user";

export const userRepository = db.getRepository(User);

export const getUser = async (guildId: string, userId: string) => {
  const existingUser = await userRepository.findOneBy({
    id: userId,
    guild: guildId
  });

  if (existingUser) return existingUser;

  const newUser = await userRepository.save({ id: userId, guild: guildId });

  return newUser;
};

export const hasUserAnswered = async (guildId: string, userId: string) => {
  const user = await getUser(guildId, userId);
  return user.answered;
};

export const markHasAnswered = async (guildId: string, userId: string) => {
  const user = await getUser(guildId, userId);

  user.answered = true;
  user.currentStreak = 0;
  user.currentPoints = 0;
  user.totalAnswers += 1;
  await userRepository.save(user);
};

export const updateWinner = async (
  guildId: string,
  userId: string,
  pointsToGive: number
) => {
  const user = await getUser(guildId, userId);

  const newStreak = user.currentStreak + 1;
  const newPoints = user.currentPoints + pointsToGive;

  user.currentStreak = newStreak;
  user.totalCorrectAnswers += 1;
  user.currentPoints = newPoints;
  user.totalAnswers += 1;
  user.answered = true;

  if (newStreak > user.highestStreak) {
    user.highestStreak = newStreak;
  }

  if (newPoints > user.highestPoints) {
    user.highestPoints = newPoints;
  }

  const updated = await userRepository.save(user);
  return updated;
};

export const resetAnswered = async () => {
  await userRepository
    .createQueryBuilder()
    .update()
    .set({ answered: false })
    .execute();
};

export const topFiveStreaks = async (guildId: string) =>
  userRepository.find({
    where: { guild: guildId },
    order: { highestStreak: "DESC" },
    take: 5
  });

export const topFiveCorrectAnswers = async (guildId: string) =>
  userRepository.find({
    where: { guild: guildId },
    order: { totalCorrectAnswers: "DESC" },
    take: 5
  });

export const topFiveTotalAnswered = async (guildId: string) =>
  userRepository.find({
    where: { guild: guildId },
    order: { totalAnswers: "DESC" },
    take: 5
  });

export const topFiveCurrentPoints = async (guildId: string) =>
  userRepository.find({
    where: { guild: guildId },
    order: { currentPoints: "DESC" },
    take: 5
  });

export const topFiveHighestPoints = async (guildId: string) =>
  userRepository.find({
    where: { guild: guildId },
    order: { highestPoints: "DESC" },
    take: 5
  });
