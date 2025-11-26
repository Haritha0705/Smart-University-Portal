import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import studentModel from "../models/memberModel.mjs";
import { Request } from "express";

export class AuthService {
    login = async (req: Request) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return { success: false, status: 400, message: "Missing required fields" };
            }

            const user = await studentModel.findOne({ email });
            if (!user) {
                return { success: false, status: 404, message: "User not found" };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { success: false, status: 400, message: "Invalid password" };
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return { success: false, status: 500, message: "Server missing JWT secret" };
            }

            const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });

            return {
                success: true,
                status: 200,
                message: "Login successful",
                data: { id: user._id.toString(), email: user.email },
                token,
            };
        } catch (error) {
            console.error(error);
            return { success: false, status: 500, message: "Internal server error" };
        }
    };

    register = async (req: Request) => {
        try {
            const { password, username, email } = req.body;

            if (!password || !email || !username) {
                return { success: false, status: 400, message: "Missing required fields" };
            }

            if (!validator.isEmail(email)) {
                return { success: false, status: 400, message: "Enter a valid email" };
            }

            if (password.length < 8) {
                return {
                    success: false,
                    status: 400,
                    message: "Password must be at least 8 characters long",
                };
            }

            const existingUser = await studentModel.findOne({
                $or: [{ email }, { username }],
            });

            if (existingUser) {
                return { success: false, status: 409, message: "User already exists" };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await studentModel.create({
                email,
                username,
                password: hashedPassword,
            });

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return { success: false, status: 500, message: "Server missing JWT secret" };
            }

            const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: "1d" });

            return {
                success: true,
                status: 201,
                message: "Registration successful",
                data: {
                    email: newUser.email,
                    username: newUser.username,
                },
                token,
            };
        } catch (error) {
            console.error(error);
            return { success: false, status: 500, message: "Internal server error" };
        }
    };
}

export default new AuthService();
