import { mapQuestion } from "./question.mapper.js";

export const mapSession = (session) => ({
  questions: session.questions.map((q) => mapQuestion(q)),
  current_page: session.current_page,
  total_questions: session.total_questions,
  questions_per_page: session.questions_per_page,
  total_pages: session.total_pages,
  last_page: session.last_page,
});
