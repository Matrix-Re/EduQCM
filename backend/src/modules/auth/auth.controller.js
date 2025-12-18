import {
    register as register_service,
    login as login_service,
    getCurrentSession,
    getUserFromRefreshToken
} from "./auth.service.js";
import jwt from "jsonwebtoken";
import { apiError } from "../../utils/error.js";
import { setRefreshTokenCookie } from "../../utils/jwt.js";

export const register = async (req, res) => {
    try {
        const { lastname, firstname, username, password, role } = req.body;
        if (!lastname || !firstname || !username || !password || !role) {
            return res.status(400).json(apiError(400, "All fields are required"));
        }
        const result = await register_service(lastname, firstname, username, password, role);
        setRefreshTokenCookie(res, result.refresh_token);
        const { refresh_token, ...safeResult } = result;
        res.json(safeResult);
    } catch (err) {
        res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json(apiError(400, "Username and password are required"));
        }
        const result = await login_service(username, password);
        setRefreshTokenCookie(res, result.refresh_token);
        const { refresh_token, ...safeResult } = result;
        res.json(safeResult);
    } catch (err) {
        res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
    }
};

export const current_session = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json(apiError(401, "No token provided"));
        }

        const token = authHeader.split(" ")[1];

        // decode token
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
                return res.status(401).json(apiError(401, "Invalid or expired token"));
            }
            return res.status(500).json(apiError(500, err.message));
        }

        const session = await getCurrentSession(decoded.id);

        res.json(session);

    } catch (err) {
        res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
    }
};

export const refresh = async (req, res) => {
    try {
        const token = req.cookies?.refresh_token;
        if (!token) return res.status(401).json(apiError(401, "Refresh token required"));

        const result = await getUserFromRefreshToken(token);

        setRefreshTokenCookie(res, result.refresh_token);
        const { refresh_token, ...safeResult } = result;
        res.json(safeResult);
    } catch (err) {
        res.status(err.status || 500).json(apiError(err.status || 500, err.message, err.details));
    }
};