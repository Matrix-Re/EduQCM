import {
    createTopic,
    getAllTopics,
    getTopicById,
    deleteTopic,
    updateTopic
} from "./topic.service.js";

/**
 * Create a new topic
 */
export const create = async (req, res) => {
    try {
        const result = await createTopic(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Get all topics
 */
export const getAll = async (req, res) => {
    try {
        const result = await getAllTopics();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get a single topic by ID (path param)
 */
export const getOne = async (req, res) => {
    try {
        const topicId = req.params.id;
        const result = await getTopicById(topicId);
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * Delete a topic
 */
export const remove = async (req, res) => {
    try {
        const topicId = req.params.id;
        const result = await deleteTopic(topicId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Update a topic (optional)
 */
export const modify = async (req, res) => {
    try {
        const topicId = req.params.id;
        const data = req.body;
        const result = await updateTopic(topicId, data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
