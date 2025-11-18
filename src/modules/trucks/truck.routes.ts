import { Router } from "express";
import { TruckController } from "./truck.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new TruckController();

router.get("/", authMiddleware, (req, res) => controller.list(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getById(req, res));
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));

export default router;
