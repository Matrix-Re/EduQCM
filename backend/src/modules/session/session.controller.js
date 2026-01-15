import { finishSession, fetchQuestionsByPage } from "./session.service.js";
import { apiError } from "../../utils/error.js";

export const getQuestionsByPage = async (req, res) => {
  const session_id = req.params.id;
  const page = parseInt(req.query.page) || 1;

  try {
    // Call the service function to get paginated questions
    const questions = await fetchQuestionsByPage(session_id, page);
    res.json(questions);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};

export const finish = async (req, res) => {
  try {
    const result = await finishSession(req.params.id);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};
