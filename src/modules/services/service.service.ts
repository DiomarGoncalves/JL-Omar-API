import { sql } from "../../db/client";
import type { Service, Material } from "../../types";

export class ServiceService {
  async list(filters?: { truckId?: string }): Promise<Service[]> {
    if (filters?.truckId) {
      return sql<Service[]>`
        SELECT * FROM services
        WHERE truck_id = ${filters.truckId}
        ORDER BY service_date DESC
      `;
    }
    return sql<Service[]>`SELECT * FROM services ORDER BY service_date DESC`;
  }

  async getById(id: string): Promise<Service | null> {
    const rows = await sql<Service[]>`SELECT * FROM services WHERE id = ${id}`;
    return rows[0] || null;
  }

  async create(data: {
    truckId: string;
    equipment: string;
    serviceDate: string;
    of: string;
    meter: number;
    value: number;
    status: "PENDENTE" | "CONCLUIDO";
    observations?: string;
  }): Promise<Service> {
    const rows = await sql<Service[]>`
      INSERT INTO services (
        truck_id, equipment, service_date, of, meter, value, status, observations
      ) VALUES (
        ${data.truckId},
        ${data.equipment},
        ${data.serviceDate},
        ${data.of},
        ${data.meter},
        ${data.value},
        ${data.status},
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
      equipment: string;
      serviceDate: string;
      of: string;
      meter: number;
      value: number;
      status: "PENDENTE" | "CONCLUIDO";
      observations: string;
    }>
  ): Promise<Service | null> {
    const current = await this.getById(id);
    if (!current) return null;
    const rows = await sql<Service[]>`
      UPDATE services
      SET
        truck_id = ${data.truckId ?? current.truck_id},
        equipment = ${data.equipment ?? current.equipment},
        service_date = ${data.serviceDate ?? current.service_date},
        of = ${data.of ?? current.of},
        meter = ${data.meter ?? current.meter},
        value = ${data.value ?? current.value},
        status = ${data.status ?? current.status},
        observations = ${data.observations ?? current.observations ?? null}
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM services WHERE id = ${id}`;
  }

  async getMaterials(serviceId: string): Promise<Material[]> {
    return sql<Material[]>`
      SELECT * FROM materials WHERE service_id = ${serviceId} ORDER BY created_at DESC
    `;
  }

  async addMaterial(
    serviceId: string,
    data: { name: string; quantity: number; observations?: string }
  ): Promise<Material> {
    const rows = await sql<Material[]>`
      INSERT INTO materials (service_id, name, quantity, unit_price, observations)
      VALUES (
        ${serviceId},
        ${data.name},
        ${data.quantity},
        0, 
        ${data.observations ?? null}
      )
      RETURNING *
    `;
    return rows[0];
  }
}
