import express from "express";
import { createAdminTest } from "../controllers/adminTest.controller";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";

const router = express.Router();

// Admin – Create test + questions
router.post("/tests", adminAuthMiddleware, createAdminTest);

export default router;
