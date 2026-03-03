import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "./config/passport";
import "./utils/taskStatusUpdater";

import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/task/task.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

// --- UPDATED CORS CONFIGURATION ---
app.use(
  cors({
    // Replace with your actual frontend URL (no trailing slash)
    origin: ["http://localhost:3000","https://task-management-frontend-three-opal.vercel.app"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;