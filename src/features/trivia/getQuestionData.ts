/* eslint-disable camelcase */
import { z } from "zod";
import { shuffleArray } from "~/utils/helpers";

const QuestionData = z.object({
  category: z.string(),
  type: z.string(),
  difficulty: z.string(),
  question: z.string(),
  correct_answer: z.string(),
  incorrect_answers: z.string().array()
});

const triviaApiEndpoint = "https://opentdb.com/api.php?amount=1&encode=url3986";

export const getQuestionData = async () => {
  const response = await fetch(triviaApiEndpoint)
    .then((res) => res.json())
    .then((result) => {
      const data = QuestionData.parse(result);
      return data;
    });

  const { question, correct_answer, incorrect_answers } = response;

  const incorrectAnswers = incorrect_answers.map((i) => decodeURIComponent(i));

  const answer = decodeURIComponent(correct_answer).trim();

  const allAnswers = shuffleArray<string>([...incorrectAnswers, answer]);

  return {
    question,
    answer,
    allAnswers,
    incorrectAnswers
  };
};
