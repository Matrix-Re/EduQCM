import {
  createTopic,
  getAllTopics,
  getTopicById,
  deleteTopic,
  updateTopic,
} from "./topic.service.js";

import { apiError } from "../../utils/error.js";

const handleError = (res, err) => {
  const status = err?.status || 500;
  return res.status(status).json(apiError(status, err?.message || "Internal server error"));
};

/*
 * Create Topic
 */
export const create = async (req, res) => {
  try {
    const result = await createTopic(req.body);
    return res.json(result);
  } catch (err) {
    return handleError(res, err);
  }
};

/*
 * Get all Topics
 */
export const getAll = async (req, res) => {
  try {
    const result = await getAllTopics();
    return res.json(result);
  } catch (err) {
    return handleError(res, err);
  }
};

/*
 * Get single Topic by ID
 */
export const getOne = async (req, res) => {
  try {
    const result = await getTopicById(req.params.id);
    return res.json(result);
  } catch (err) {
    return handleError(res, err);
  }
};

/*
 * Delete Topic
 */
export const remove = async (req, res) => {
  try {
    const result = await deleteTopic(req.params.id);
    return res.json(result);
  } catch (err) {
    return handleError(res, err);
  }
};

/*
 * Update Topic
 */
export const modify = async (req, res) => {
  try {
    const result = await updateTopic(req.params.id, req.body);
    return res.json(result);
  } catch (err) {
    return handleError(res, err);
  }
};
