import jwt from "jsonwebtoken";
import { apiError } from "../utils/error.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json(apiError(401, "No token provided"));
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json(apiError(401, "Invalid authorization format"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On attache l'utilisateur à la requête
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json(apiError(401, "Invalid or expired token"));
    }

    return res.status(500).json(apiError(500, err.message));
  }
};

export default authMiddleware;
