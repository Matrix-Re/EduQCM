import {
    createProposal,
    modifyProposal,
    removeProposal,
} from "./proposal.service.js";


export const create = async (req, res) => {
    try {
        const result = await createProposal(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const modify = async (req, res) => {
    try {
        const result = await modifyProposal(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        const result = await removeProposal(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

