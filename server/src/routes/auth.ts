import { Router } from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Test endpoint to verify authentication is working
router.get("/me", authenticateToken, (req: AuthenticatedRequest, res) => {
    res.json({
        user: req.user,
        message: "Authentication successful"
    });
});

// Health check endpoint (no auth required)
router.get("/health", (_req, res) => {
    res.json({ status: "Auth service is running" });
});

export default router;