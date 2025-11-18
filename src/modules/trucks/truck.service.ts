import { sql } from "../../db/client";
import type { Truck } from "../../types";

export class TruckService {
  async list(): Promise<Truck[]> {
    return sql<Truck[]>`SELECT id, brand, model, year, observations FROM trucks ORDER BY created_at DESC`;
  }

  async getById(id: string): Promise<Truck | null> {
    const rows = await sql<Truck[]>`SELECT id, brand, model, year, observations FROM trucks WHERE id = ${id}`;
    return rows[0] || null;
  }

  async create(data: { brand: string; model: string; year: number; observations?: string }): Promise<Truck> {
    const rows = await sql<Truck[]>`
      INSERT INTO trucks (brand, model, year, observations)
      VALUES (${data.brand}, ${data.model}, ${data.year}, ${data.observations ?? null})
      RETURNING id, brand, model, year, observations
    `;
    return rows[0];
  }

  async update(
    id: string,
    data: Partial<{ brand: string; model: string; year: number; observations: string }>
  ): Promise<Truck | null> {
    const current = await this.getById(id);
    if (!current) return null;
    const rows = await sql<Truck[]>`
      UPDATE trucks
      SET
        brand = ${data.brand ?? current.brand},
        model = ${data.model ?? current.model},
        year = ${data.year ?? current.year},
        observations = ${data.observations ?? current.observations ?? null}
      WHERE id = ${id}
      RETURNING id, brand, model, year, observations
    `;
    return rows[0] || null;
  }

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM trucks WHERE id = ${id}`;
  }
}
