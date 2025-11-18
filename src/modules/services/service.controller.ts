import { Request, Response } from "express";
import { ServiceService } from "./service.service";

const service = new ServiceService();

export class ServiceController {
  async list(req: Request, res: Response) {
    try {
      const { truckId } = req.query;
      const services = await service.list({ truckId: truckId ? String(truckId) : undefined });
      return res.json(services);
    } catch {
      return res.status(500).json({ message: "Erro ao listar serviços" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const s = await service.getById(id);
      if (!s) return res.status(404).json({ message: "Serviço não encontrado" });
      return res.json(s);
    } catch {
      return res.status(500).json({ message: "Erro ao buscar serviço" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { truckId, equipment, serviceDate, of, meter, value, status, observations } = req.body;
      if (!truckId || !equipment || !serviceDate || !of || meter == null || value == null || !status) {
        return res.status(400).json({
          message: "truckId, equipment, serviceDate, of, meter, value e status são obrigatórios"
        });
      }
      const created = await service.create({
        truckId,
        equipment,
        serviceDate,
        of,
        meter: Number(meter),
        value: Number(value),
        status,
        observations
      });
      return res.status(201).json(created);
    } catch {
      return res.status(500).json({ message: "Erro ao criar serviço" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await service.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "Serviço não encontrado" });
      return res.json(updated);
    } catch {
      return res.status(500).json({ message: "Erro ao atualizar serviço" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return res.status(204).send();
    } catch {
      return res.status(500).json({ message: "Erro ao excluir serviço" });
    }
  }

  async listMaterials(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const materials = await service.getMaterials(id);
      return res.json(materials);
    } catch {
      return res.status(500).json({ message: "Erro ao listar materiais" });
    }
  }

   async addMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, quantity, observations } = req.body || {};

      // Agora só exigimos name e quantity
      if (!name || quantity == null) {
        return res.status(400).json({
          message: "name e quantity são obrigatórios",
          receivedBody: req.body,
        });
      }

      const material = await service.addMaterial(id, {
        name,
        quantity: Number(quantity),
        observations,
      });

      return res.status(201).json(material);
    } catch (error) {
      console.error("Erro ao adicionar material:", error);
      return res.status(500).json({ message: "Erro ao adicionar material" });
    }
  }
}
