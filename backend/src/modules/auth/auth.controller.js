import {registerUser, loginUser, getCurrentSession} from "./auth.service.js";
import jwt from "jsonwebtoken";

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

export const currentSession = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Décoder le token ici (comme le ferait le middleware)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded = { id, role, iat, exp }
        const session = await getCurrentSession(decoded.userId);

        res.json(session);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};