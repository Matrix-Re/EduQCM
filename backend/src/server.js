import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import questionRoutes from "./modules/question/question.routes.js";
import proposalRoutes from "./modules/proposal/proposal.routes.js";
import topicRoutes from "./modules/topic/topic.routes.js"
import quizRoutes from "./modules/quiz/quiz.routes.js"
import userRoutes from "./modules/user/user.routes.js";
import answerRoutes from "./modules/answer/answer.routes.js";
import resultRoutes from "./modules/result/result.routes.js";
import dotenv from "dotenv";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/question", questionRoutes);
app.use("/proposal", proposalRoutes);
app.use("/topic", topicRoutes);
app.use("/qcm", quizRoutes);
app.use("/user", userRoutes)
app.use("/answer", answerRoutes)
app.use("/result", resultRoutes)

// Swagger Setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default app;

if (process.env.NODE_ENV !== "test") {
    app.listen(3000, () => console.log("API running on http://localhost:3000"));
}