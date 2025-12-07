import { sql } from "../../db/client";
import type { Measurement } from "../../types";

export class MeasurementService {
  async list(filters: {
    truckId?: string;
    serviceId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Measurement[]> {
    const where = [];
    const params = [];

    if (filters.truckId) {
      where.push("m.truck_id = $${params.length + 1}");
      params.push(filters.truckId);
    }

    if (filters.serviceId) {
      where.push("m.service_id = $${params.length + 1}");
      params.push(filters.serviceId);
    }

    if (filters.startDate) {
      where.push("m.measurement_date >= $${params.length + 1}");
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      where.push("m.measurement_date <= $${params.length + 1}");
      params.push(filters.endDate);
    }

    const whereSQL = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT *
      FROM measurements m
      ${whereSQL}
      ORDER BY m.measurement_date DESC
    `;

    return sql(query, params);
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
        truck_id, service_id, measurement_date,
        technician, value_before, value_after, observations
      )
      VALUES (
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

  async update(id: string, data: Partial<Measurement>): Promise<Measurement | null> {
    const current = await sql<Measurement[]>`
      SELECT * FROM measurements WHERE id = ${id}
    `;
    if (!current[0]) return null;

    const row = current[0];

    const updated = await sql<Measurement[]>`
      UPDATE measurements SET
        truck_id = ${data.truckId ?? row.truck_id},
        service_id = ${data.serviceId ?? row.service_id},
        measurement_date = ${data.measurementDate ?? row.measurement_date},
        technician = ${data.technician ?? row.technician},
        value_before = ${data.valueBefore ?? row.value_before},
        value_after = ${data.valueAfter ?? row.value_after},
        observations = ${data.observations ?? row.observations}
      WHERE id = ${id}
      RETURNING *
    `;
    return updated[0];
  }

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM measurements WHERE id = ${id}`;
  }
}
