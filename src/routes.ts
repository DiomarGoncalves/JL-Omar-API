import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import truckRoutes from "./modules/trucks/truck.routes";
import serviceRoutes from "./modules/services/service.routes";
import measurementRoutes from "./modules/measurements/measurement.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "TruckControl API - OK" });
});

router.use("/auth", authRoutes);
router.use("/trucks", truckRoutes);
router.use("/services", serviceRoutes);
router.use("/measurements", measurementRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
