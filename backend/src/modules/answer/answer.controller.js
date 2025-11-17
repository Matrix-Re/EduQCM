import { submitAnswer } from "./answer.service.js";

export const create = async (req, res) => {
    try {
        const result = await submitAnswer(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
