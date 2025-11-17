import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await loginUser(username, password);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
