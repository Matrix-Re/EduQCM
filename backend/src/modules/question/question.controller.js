import {
  createQuestion,
  modifyQuestion,
  removeQuestion,
  getQuestion,
} from "./question.service.js";
import { apiError } from "../../utils/error.js";

export const create = async (req, res) => {
  try {
    const result = await createQuestion(req.body);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};

export const modify = async (req, res) => {
  try {
    const result = await modifyQuestion(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};

export const remove = async (req, res) => {
  try {
    const result = await removeQuestion(req.params.id);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};

export const get = async (req, res) => {
  try {
    const result = await getQuestion(req.params.id);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json(apiError(err.status || 500, err.message, err.details));
  }
};
