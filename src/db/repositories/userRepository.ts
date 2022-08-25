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
  user.totalAnswers += 1;
  await userRepository.save(user);
};

export const resetStreaks = async (userId: string) => {
  // Reset everyone except the winner
  await userRepository
    .createQueryBuilder()
    .update()
    .set({ currentStreak: 0 })
    .where("id != :userId", { userId })
    .execute();
};

export const updateWinner = async (guildId: string, userId: string) => {
  const user = await getUser(guildId, userId);

  user.currentStreak += 1;
  user.highestStreak += 1;
  user.totalCorrectAnswers += 1;
  user.totalAnswers += 1;
  user.answered = true;
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
