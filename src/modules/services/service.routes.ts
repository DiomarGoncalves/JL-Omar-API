import { Router } from "express";
import { ServiceController } from "./service.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new ServiceController();

router.get("/", authMiddleware, (req, res) => controller.list(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getById(req, res));
router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));
router.get("/:id/materials", authMiddleware, (req, res) => controller.listMaterials(req, res));
router.post("/:id/materials", authMiddleware, (req, res) => controller.addMaterial(req, res));
router.put("/:id/materials/:materialId", authMiddleware, (req, res) => controller.updateMaterial(req, res));
router.delete("/:id/materials/:materialId", authMiddleware, (req, res) => controller.deleteMaterial(req, res));

export default router;
