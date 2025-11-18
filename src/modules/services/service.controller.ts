import { Request, Response } from "express";
import { ServiceService } from "./service.service";

const service = new ServiceService();

function mapServiceRow(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    truckId: row.truck_id,
    equipment: row.equipment,
    serviceDate: row.service_date,
    of: row.of,
    meter: Number(row.meter),
    value: Number(row.value),
    status: row.status,
    observations: row.observations,
    chassis: row.chassis,
    createdAt: row.created_at,
  };
}

export class ServiceController {
  async list(req: Request, res: Response) {
    try {
      const { truckId } = req.query;

      const services = await service.list({
        truckId: truckId ? String(truckId) : undefined,
      });

      // 🔹 Agora devolve tudo em camelCase
      return res.json(services.map(mapServiceRow));
    } catch (error) {
      console.error("Erro ao listar serviços:", error);
      return res.status(500).json({ message: "Erro ao listar serviços" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const found = await service.getById(id);

      if (!found) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      return res.json(mapServiceRow(found));
    } catch (error) {
      console.error("Erro ao buscar serviço:", error);
      return res.status(500).json({ message: "Erro ao buscar serviço" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const {
        truckId,
        equipment,
        serviceDate,
        of,
        meter,
        value,
        status,
        observations,
        chassis,
      } = req.body;
      if (
        !truckId ||
        !equipment ||
        !serviceDate ||
        !of ||
        meter == null ||
        value == null ||
        !status
      ) {
        return res.status(400).json({
          message:
            "truckId, equipment, serviceDate, of, meter, value e status são obrigatórios",
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
        observations,
        chassis,
      });

      // 🔹 em vez de retornar a linha raw do banco:
      return res.status(201).json(mapServiceRow(created));
    } catch {
      return res.status(500).json({ message: "Erro ao criar serviço" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await service.update(id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Serviço não encontrado" });
      return res.json(mapServiceRow(updated));
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

  async updateMaterial(req: Request, res: Response) {
    try {
      const { id: serviceId, materialId } = req.params as {
        id: string;
        materialId: string;
      };
      const { name, quantity, observations } = req.body || {};
      const updated = await service.updateMaterial(serviceId, materialId, {
        name,
        quantity: quantity != null ? Number(quantity) : undefined,
        observations,
      });
      if (!updated)
        return res.status(404).json({ message: "Material não encontrado" });
      return res.json(updated);
    } catch (error) {
      console.error("Erro ao atualizar material:", error);
      return res.status(500).json({ message: "Erro ao atualizar material" });
    }
  }

  async deleteMaterial(req: Request, res: Response) {
    try {
      const { id: serviceId, materialId } = req.params as {
        id: string;
        materialId: string;
      };
      await service.deleteMaterial(serviceId, materialId);
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir material:", error);
      return res.status(500).json({ message: "Erro ao excluir material" });
    }
  }
}
