import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import authRoutes from "./modules/auth/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import userRoutes from "./modules/user/user.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Swagger Setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import Routes
app.use(process.env.API_BASE_PATH + "/auth", authRoutes);
app.use(authMiddleware);
app.use(process.env.API_BASE_PATH + "/users", userRoutes);

export default app;

if (process.env.NODE_ENV !== "test") {
    const server = app.listen(process.env.API_PORT, () => {
        console.log(
            `API running on ${process.env.API_URL}${process.env.API_BASE_PATH}`
        );
    });

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Le port ${process.env.API_PORT} est déjà utilisé`);
            process.exit(1);
        } else {
            console.error("❌ Erreur serveur :", err);
        }
    });
}