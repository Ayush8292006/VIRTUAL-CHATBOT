import express from "express";
import { login, logout, signUp } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

// Use the correct router variable
authRouter.post("/signup", signUp);
authRouter.post("/signin", login);
authRouter.get("/logout", logout);

export default authRouter;
