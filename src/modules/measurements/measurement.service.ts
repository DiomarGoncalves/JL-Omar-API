import { sql } from "../../db/client";
import type { Measurement } from "../../types";

export class MeasurementService {
  async list(filters?: {
    truckId?: string;
    serviceId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Measurement[]> {
    let where = sql`1 = 1`;
    if (filters?.truckId) where = sql`${where} AND truck_id = ${filters.truckId}`;
    if (filters?.serviceId) where = sql`${where} AND service_id = ${filters.serviceId}`;
    if (filters?.startDate) where = sql`${where} AND measurement_date >= ${filters.startDate}`;
    if (filters?.endDate) where = sql`${where} AND measurement_date <= ${filters.endDate}`;
    const rows = await sql<Measurement[]>`
      SELECT * FROM measurements WHERE ${where} ORDER BY measurement_date DESC
    `;
    return rows;
  }

  async create(data: {
    truckId: string;
    serviceId?: string;
    measurementDate: string;
    technician: string;
    valueBefore: number;
    valueAfter: number;
    observations?: string;
  }): Promise<Measurement> {
    const rows = await sql<Measurement[]>`
      INSERT INTO measurements (
        truck_id, service_id, measurement_date, technician,
        value_before, value_after, observations
      ) VALUES (
        ${data.truckId},
        ${data.serviceId ?? null},
        ${data.measurementDate},
        ${data.technician},
        ${data.valueBefore},
        ${data.valueAfter},
        ${data.observations ?? null}
      )
      RETURNING *
    `;
    return rows[0];
  }
}
