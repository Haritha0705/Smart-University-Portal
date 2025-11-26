import { Router } from "express";
import authControllers from "../controllers/authControllers.mjs";

const authRoutes = Router();

authRoutes.post("/login", authControllers.login);
authRoutes.post("/register", authControllers.register);

export default authRoutes;
