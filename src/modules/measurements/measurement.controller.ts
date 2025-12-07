import { Request, Response } from "express";
import { MeasurementService } from "./measurement.service";

const service = new MeasurementService();

export class MeasurementController {
  async list(req: Request, res: Response) {
  try {
    const { truckId, serviceId, startDate, endDate } = req.query;
    const measurements = await service.list({
      truckId: truckId ? String(truckId) : undefined,
      serviceId: serviceId ? String(serviceId) : undefined,
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined
    });
    return res.json(measurements);
  } catch (error) {
    console.error("❌ Erro no MeasurementController.list:", error);
    return res.status(500).json({ message: "Erro ao listar medições" });
  }
}


  async create(req: Request, res: Response) {
    try {
      const { truckId, serviceId, measurementDate, technician, valueBefore, valueAfter, observations } = req.body;
      if (!truckId || !measurementDate || !technician || valueBefore == null || valueAfter == null) {
        return res.status(400).json({
          message: "truckId, measurementDate, technician, valueBefore e valueAfter são obrigatórios"
        });
      }
      const created = await service.create({
        truckId,
        serviceId,
        measurementDate,
        technician,
        valueBefore: Number(valueBefore),
        valueAfter: Number(valueAfter),
        observations
      });
      return res.status(201).json(created);
    } catch {
      return res.status(500).json({ message: "Erro ao criar medição" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = req.body || {};
      // convert numeric fields when present
      if (payload.valueBefore != null) payload.valueBefore = Number(payload.valueBefore);
      if (payload.valueAfter != null) payload.valueAfter = Number(payload.valueAfter);

      const updated = await service.update(id, {
        truckId: payload.truckId,
        serviceId: payload.serviceId,
        measurementDate: payload.measurementDate,
        technician: payload.technician,
        valueBefore: payload.valueBefore,
        valueAfter: payload.valueAfter,
        observations: payload.observations,
      });

      if (!updated) return res.status(404).json({ message: "Medição não encontrada" });
      return res.json(updated);
    } catch {
      return res.status(500).json({ message: "Erro ao atualizar medição" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return res.status(204).send();
    } catch {
      return res.status(500).json({ message: "Erro ao excluir medição" });
    }
  }
}
