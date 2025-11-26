// src/routes/studentRoutes.ts
import { Router, Request, Response } from "express";
import { wso2Authenticate } from "../middlewares/wso2-auth.middleware";
import { trustApiGateway } from "../middlewares/trust-api-gateway";
import studentModel from "../models/memberModel.mjs"; // your existing mongoose model

const router = Router();

/**
 * Example: protected endpoint using backend introspection (call backend directly)
 */
router.get("/introspect-protected", wso2Authenticate, async (req: Request, res: Response) => {
    // req.user is populated by wso2Authenticate
    const user = (req as any).user;
    // fetch some data
    const students = await studentModel.find().limit(10);
    return res.json({ success: true, authUser: user, data: students });
});

/**
 * Example: protected endpoint when APIM validated the token and forwarded user info
 * (recommended in production if APIM is used)
 */
router.get("/gateway-protected", trustApiGateway, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const students = await studentModel.find().limit(10);
    return res.json({ success: true, authUser: user, data: students });
});

export default router;
