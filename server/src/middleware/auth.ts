import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    isAnonymous: boolean;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAnonymous: decodedToken.firebase.sign_in_provider === "anonymous"
    };
    next();
  } catch (error) {
    console.error("Token validation failed:", error);
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};

// Optional authentication - for routes that work with or without auth
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        isAnonymous: decodedToken.firebase.sign_in_provider === "anonymous"
      };
    } catch (error) {
      // Token is invalid but we continue without user context
      console.warn("Optional auth failed:", error);
    }
  }

  next();
};
