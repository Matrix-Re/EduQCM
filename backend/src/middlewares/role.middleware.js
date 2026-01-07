import { apiError } from "../utils/error.js";

export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json(apiError(403, "Access denied"));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(apiError(403, "Insufficient permissions"));
        }

        next();
    };
};