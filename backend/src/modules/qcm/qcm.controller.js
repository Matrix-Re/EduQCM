import {
  createQcm,
  getAllQcm,
  getQcmById,
  deleteQcm,
  updateQcm,
  assignQcmToStudent,
} from "./qcm.service.js";

import { apiError } from "../../utils/error.js";

/**
 * Create QCM
 */
export const create = async (req, res) => {
  try {
    const result = await createQcm(req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
  }
};

/**
 * Get all QCMs
 */
export const getAll = async (req, res) => {
  try {
    const result = await getAllQcm();
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
  }
};

/**
 * Get single QCM by ID
 */
export const getOne = async (req, res) => {
  try {
    const result = await getQcmById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
  }
};

/**
 * Delete QCM
 */
export const remove = async (req, res) => {
  try {
    const result = await deleteQcm(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
  }
};

/**
 * Update QCM
 */
export const modify = async (req, res) => {
  try {
    const result = await updateQcm(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
  }
};

/**
 * Assign QCM to a student
 */
export const assign = async (req, res) => {
  try {
    const { student_id } = req.body;
    const result = await assignQcmToStudent(req.params.id, student_id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
  }
};
