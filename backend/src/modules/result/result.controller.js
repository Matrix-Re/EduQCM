import { updateResultScore } from "./result.service.js";

export const update = async (req, res) => {
    try {
        const result = await updateResultScore(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
