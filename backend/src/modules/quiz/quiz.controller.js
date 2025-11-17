import {
    createQcm,
    getAllQcm,
    getQcmById,
    deleteQcm,
    updateQcm,
    assignQcmToStudent
} from "./quiz.service.js";

/**
 * Create QCM
 */
export const create = async (req, res) => {
    try {
        const result = await createQcm(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get single QCM by ID
 */
export const getOne = async (req, res) => {
    try {
        const qcmId = req.params.id;
        const result = await getQcmById(qcmId);
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * Delete QCM
 */
export const remove = async (req, res) => {
    try {
        const qcmId = req.params.id;
        const result = await deleteQcm(qcmId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Update QCM
 */
export const modify = async (req, res) => {
    try {
        const qcmId = req.params.id;
        const data = req.body;
        const result = await updateQcm(qcmId, data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Assign QCM to a student
 */
export const assign = async (req, res) => {
    try {
        const qcmId = req.params.id;
        const { studentId } = req.body;

        const result = await assignQcmToStudent(qcmId, studentId);

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
