import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/test.routes";
import questionRoutes from "./routes/question.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import attemptRoutes from "./routes/attempt.routes";
import adminRoutes from "./routes/admin.routes";
import adminTestRoutes from "./routes/adminTest.routes";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
// app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:4000",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/attempts", attemptRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tests", authMiddleware, testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminTestRoutes);

export default app;
