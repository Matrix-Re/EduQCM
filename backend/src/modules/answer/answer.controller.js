import { submitAnswer } from "./answer.service.js";
import { apiError } from "../../utils/error.js";

export const create = async (req, res) => {
  try {
    const result = await submitAnswer(req.body);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};
