// src/middleware/wso2-auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import axios from "axios";

export interface AuthRequest extends Request {
    user?: {
        sub?: string;
        client_id?: string;
        scope?: string[];
        [key: string]: any;
    };
}

const introspectUrl = process.env.JWT_INTROSPECTION_URL as string;
const clientId = process.env.INTROSPECTION_CLIENT_ID as string;
const clientSecret = process.env.INTROSPECTION_CLIENT_SECRET as string;

/**
 * Introspect an access token at WSO2 IS.
 * Returns the introspection response object. Example: { active: true, scope: "...", client_id: "...", sub: "user" }
 */
async function introspectToken(token: string) {
    if (!introspectUrl || !clientId || !clientSecret) {
        throw new Error("Introspection URL / client credentials not configured");
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const params = new URLSearchParams();
    params.append("token", token);

    // NOTE: For local WSO2 with self-signed certs you may need to relax TLS in dev:
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // dev only, NOT for production

    const resp = await axios.post(introspectUrl, params.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${basicAuth}`,
        },
        timeout: 5000,
    });

    return resp.data;
}

export const wso2Authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false, message: "Missing Authorization header" });

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(400).json({ success: false, message: "Invalid Authorization header format" });
        }

        const token = parts[1];

        const introspection = await introspectToken(token);

        if (!introspection || introspection.active !== true) {
            return res.status(401).json({ success: false, message: "Token invalid or expired" });
        }

        // Map fields we commonly need
        req.user = {
            sub: (introspection.sub as string) || (introspection.username as string) || (introspection.user_id as string),
            client_id: introspection.client_id,
            scope: (introspection.scope ? (introspection.scope as string).split(" ") : []),
            // attach introspection payload if you want more claims
            introspection,
        };

        next();
    } catch (err: any) {
        console.error("Introspection error:", err.response?.data || err.message || err);
        // If introspection endpoint returns invalid/401, respond 401; if network error, 502
        if (err.response && err.response.status === 401) {
            return res.status(401).json({ success: false, message: "Token invalid or expired" });
        }
        return res.status(502).json({ success: false, message: "Token validation failed", error: err.message });
    }
};
