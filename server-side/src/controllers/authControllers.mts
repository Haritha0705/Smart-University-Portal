import { Request, Response } from "express";
import authService, { AuthService } from "../service/authService.mjs";

class AuthControllers {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.authService.login(req);

            if (!result.success) {
                res.status(result.status ?? 500).json({
                    success: false,
                    message: result.message,
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
                token: result.token,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.authService.register(req);

            if (!result.success) {
                res.status(result.status ?? 500).json({
                    success: false,
                    message: result.message,
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
                token: result.token,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    };
}

export default new AuthControllers(authService);
