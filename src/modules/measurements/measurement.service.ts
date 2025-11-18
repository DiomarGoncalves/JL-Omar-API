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

  async update(
    id: string,
    data: Partial<{
      truckId: string;
      serviceId?: string;
      measurementDate: string;
      technician: string;
      valueBefore: number;
      valueAfter: number;
      observations: string;
    }>
  ): Promise<Measurement | null> {
    const currentRows = await sql<Measurement[]>`SELECT * FROM measurements WHERE id = ${id}`;
    const current = currentRows[0];
    if (!current) return null;

    const rows = await sql<Measurement[]>`
      UPDATE measurements
      SET
        truck_id = ${data.truckId ?? current.truck_id},
        service_id = ${data.serviceId ?? current.service_id ?? null},
        measurement_date = ${data.measurementDate ?? current.measurement_date},
        technician = ${data.technician ?? current.technician},
        value_before = ${data.valueBefore ?? current.value_before},
        value_after = ${data.valueAfter ?? current.value_after},
        observations = ${data.observations ?? current.observations ?? null}
      WHERE id = ${id}
      RETURNING *
    `;

    return rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM measurements WHERE id = ${id}`;
  }
}
