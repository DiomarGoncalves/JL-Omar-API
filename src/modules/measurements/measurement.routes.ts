import { Router } from "express";
import { MeasurementController } from "./measurement.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new MeasurementController();

router.get("/", authMiddleware, (req, res) => controller.list(req, res));
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));

export default router;
