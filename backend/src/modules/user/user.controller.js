import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAssignedQcmForStudent
} from "./user.service.js";
import { apiError } from "../../utils/error.js";

/**
 * Retrieve all users
 */
export const getAll = async (req, res) => {
    try {
        const result = await getAllUsers();
        res.json(result);
    } catch (err) {
        res
            .status(err.status || 500)
            .json(apiError(err.status || 500, err.message, err.details));
    }
};

/**
 * Retrieve a single user
 */
export const getOne = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const result = await getUserById(userId);
        res.json(result);
    } catch (err) {
        res
            .status(err.status || 404)
            .json(apiError(err.status || 404, err.message));
    }
};

/**
 * Update user information
 */
export const modify = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const result = await updateUser(userId, req.body);
        res.json(result);
    } catch (err) {
        res
            .status(err.status || 400)
            .json(apiError(err.status || 400, err.message));
    }
};

/**
 * Delete a user
 */
export const remove = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const result = await deleteUser(userId);
        res.json(result);
    } catch (err) {
        res
            .status(err.status || 404)
            .json(apiError(err.status || 404, err.message));
    }
};

/**
 * Get all QCM assigned to a student
 */
export const getAssignedQcm = async (req, res) => {
    try {
        const studentId = Number(req.params.id);
        const result = await getAssignedQcmForStudent(studentId);
        res.json(result);
    } catch (err) {
        res
            .status(err.status || 404)
            .json(apiError(err.status || 404, err.message));
    }
};
