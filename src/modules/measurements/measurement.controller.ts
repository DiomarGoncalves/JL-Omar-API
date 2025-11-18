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
    } catch {
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
}
