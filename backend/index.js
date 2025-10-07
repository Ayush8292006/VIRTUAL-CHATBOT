import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: "https://virtual-chatbot-frontend-yth1.onrender.com", // frontend port
    credentials: true
}));
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Fixed: added try/catch & prompt fallback


// Start server after DB connection
const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to DB:", error.message);
        process.exit(1);
    }
};

startServer();
