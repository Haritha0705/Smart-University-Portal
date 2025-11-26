// src/middleware/trust-api-gateway.ts
import { Request, Response, NextFunction } from "express";

export interface GatewayRequest extends Request {
    user?: {
        sub?: string;
        scopes?: string[];
        [k: string]: any;
    };
}

/**
 * Trust the API gateway (APIM) to authenticate the request.
 * The gateway must forward user info in headers. Header names can vary depending on gateway config.
 * Common headers: x-wso2-authenticated-userid, x-authenticated-user, x-scopes, x-wso2-scopes
 */
export const trustApiGateway = (req: GatewayRequest, res: Response, next: NextFunction) => {
    // Try a few header names; adapt these to your APIM gateway configuration
    const userHeader = (req.headers["x-wso2-authenticated-userid"] || req.headers["x-authenticated-user"] || req.headers["x-user-id"]) as string | undefined;
    const scopesHeader = (req.headers["x-wso2-scopes"] || req.headers["x-scopes"] || req.headers["x-authenticated-scopes"]) as string | undefined;

    if (!userHeader) {
        return res.status(401).json({ success: false, message: "Request not authenticated by API gateway (missing forwarded user header)" });
    }

    const scopes = scopesHeader ? scopesHeader.toString().split(" ") : [];

    req.user = {
        sub: userHeader.toString(),
        scopes,
    };

    next();
};
