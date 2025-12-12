import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Swagger Setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default app;

if (process.env.NODE_ENV !== "test") {
    app.listen(3000, () => console.log("API running on " + process.env.API_URL));
}