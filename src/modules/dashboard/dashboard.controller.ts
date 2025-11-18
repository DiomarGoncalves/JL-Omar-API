import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const service = new DashboardService();

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await service.getStats();
      return res.json(stats);
    } catch {
      return res.status(500).json({ message: "Erro ao obter dados do dashboard" });
    }
  }
}
