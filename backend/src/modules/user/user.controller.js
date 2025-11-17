import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAssignedQcmForStudent
} from "./user.service.js";

/**
 * Retrieve all users
 */
export const getAll = async (req, res) => {
    try {
        const result = await getAllUsers();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Retrieve a single user
 */
export const getOne = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await getUserById(userId);
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * Update user information
 */
export const modify = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await updateUser(userId, req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Delete a user
 */
export const remove = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await deleteUser(userId);
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * Get all QCM assigned to a student
 */
export const getAssignedQcm = async (req, res) => {
    try {
        const studentId = req.params.id;
        const result = await getAssignedQcmForStudent(studentId);
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
