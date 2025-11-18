import { Request, Response } from "express";
import { TruckService } from "./truck.service";

const service = new TruckService();

export class TruckController {
  async list(req: Request, res: Response) {
    try {
      const trucks = await service.list();
      return res.json(trucks);
    } catch {
      return res.status(500).json({ message: "Erro ao listar caminhões" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const truck = await service.getById(id);
      if (!truck) return res.status(404).json({ message: "Caminhão não encontrado" });
      return res.json(truck);
    } catch {
      return res.status(500).json({ message: "Erro ao buscar caminhão" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { brand, model, year, observations } = req.body;
      if (!brand || !model || !year) {
        return res.status(400).json({ message: "brand, model e year são obrigatórios" });
      }
      const truck = await service.create({ brand, model, year, observations });
      return res.status(201).json(truck);
    } catch {
      return res.status(500).json({ message: "Erro ao criar caminhão" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await service.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "Caminhão não encontrado" });
      return res.json(updated);
    } catch {
      return res.status(500).json({ message: "Erro ao atualizar caminhão" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return res.status(204).send();
    } catch {
      return res.status(500).json({ message: "Erro ao excluir caminhão" });
    }
  }
}
