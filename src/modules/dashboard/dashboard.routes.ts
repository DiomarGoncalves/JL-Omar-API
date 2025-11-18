import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new DashboardController();

router.get("/", authMiddleware, (req, res) => controller.getStats(req, res));

export default router;
