import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import authRoutes from "./modules/auth/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import userRoutes from "./modules/user/user.routes.js";
import qcmRoutes from "./modules/qcm/qcm.routes.js";
import topicRoutes from "./modules/topic/topic.routes.js";
import questionRoutes from "./modules/question/question.routes.js";
import proposalRoutes from "./modules/proposal/proposal.routes.js";

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
app.use(process.env.API_BASE_PATH + "/qcm", qcmRoutes);
app.use(process.env.API_BASE_PATH + "/topic", topicRoutes);
app.use(process.env.API_BASE_PATH + "/question", questionRoutes);
app.use(process.env.API_BASE_PATH + "/proposal", proposalRoutes);

export default app;

if (process.env.NODE_ENV !== "test") {
  const server = app.listen(process.env.API_PORT, () => {
    console.log(
      `API running on ${process.env.API_URL}${process.env.API_BASE_PATH}`
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`The port ${process.env.API_PORT} is already in use`);
      process.exit(1);
    } else {
      console.error("❌ Server error:", err);
    }
  });
}
