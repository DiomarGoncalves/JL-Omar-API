import { sql } from "../../db/client";
import type { Service, Material } from "../../types";

/**
 * ServiceService
 *
 * Camada de acesso a dados para Serviços e Materiais.
 * Todas as operações que falam com o banco de dados da tabela services / materials
 * passam por aqui.
 */
export class ServiceService {
  /**
   * Lista serviços, opcionalmente filtrando por caminhão.
   */
  async list(filters?: { truckId?: string }): Promise<Service[]> {
    if (filters?.truckId) {
      return sql<Service[]>`
        SELECT * FROM services
        WHERE truck_id = ${filters.truckId}
        ORDER BY service_date DESC
      `;
    }

    return sql<Service[]>`
      SELECT *
      FROM services
      ORDER BY service_date DESC
    `;
  }

  /**
   * Busca um serviço pelo ID.
   */
  async getById(id: string): Promise<Service | null> {
    const rows = await sql<Service[]>`
      SELECT *
      FROM services
      WHERE id = ${id}
    `;
    return rows[0] || null;
  }

  /**
   * Cria um novo serviço.
   * Agora com suporte ao campo chassis.
   */
  async create(data: {
    truckId: string;
    equipment: string;
    serviceDate: string;
    of: string;
    meter: number;
    value: number;
    status: "PENDENTE" | "CONCLUIDO";
    observations?: string;
    chassis?: string;
  }): Promise<Service> {
    const rows = await sql<Service[]>`
      INSERT INTO services (
        truck_id,
        equipment,
        service_date,
        of,
        meter,
        value,
        status,
        observations,
        chassis
      )
      VALUES (
        ${data.truckId},
        ${data.equipment},
        ${data.serviceDate},
        ${data.of},
        ${data.meter},
        ${data.value},
        ${data.status},
        ${data.observations ?? null},
        ${data.chassis ?? null}
      )
      RETURNING *
    `;
    return rows[0];
  }

  /**
   * Atualiza parcialmente um serviço existente.
   * Os campos não enviados permanecem com o valor atual.
   */
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
      chassis: string;
    }>
  ): Promise<Service | null> {
    const current = await this.getById(id);
    if (!current) return null;

    const rows = await sql<Service[]>`
      UPDATE services
      SET
        truck_id     = ${data.truckId      ?? current.truck_id},
        equipment    = ${data.equipment    ?? current.equipment},
        service_date = ${data.serviceDate  ?? current.service_date},
        of           = ${data.of           ?? current.of},
        meter        = ${data.meter        ?? current.meter},
        value        = ${data.value        ?? current.value},
        status       = ${data.status       ?? current.status},
        observations = ${data.observations ?? current.observations ?? null},
        chassis      = ${data.chassis      ?? (current as any).chassis ?? null}
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] || null;
  }

  /**
   * Remove um serviço pelo ID.
   */
  async delete(id: string): Promise<void> {
    await sql`
      DELETE FROM services
      WHERE id = ${id}
    `;
  }

  /**
   * Lista materiais de um serviço.
   */
  async getMaterials(serviceId: string): Promise<Material[]> {
    return sql<Material[]>`
      SELECT *
      FROM materials
      WHERE service_id = ${serviceId}
      ORDER BY created_at DESC
    `;
  }

  /**
   * Adiciona um material a um serviço.
   * Observação: não utilizamos preço no front, então unit_price é sempre 0.
   */
  async addMaterial(
    serviceId: string,
    data: { name: string; quantity: number; observations?: string }
  ): Promise<Material> {
    const rows = await sql<Material[]>`
      INSERT INTO materials (
        service_id,
        name,
        quantity,
        unit_price,
        observations
      )
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

  /**
   * Atualiza um material de um serviço.
   */
  async updateMaterial(
    serviceId: string,
    materialId: string,
    data: Partial<{ name: string; quantity: number; observations: string }>
  ): Promise<Material | null> {
    const rows = await sql<Material[]>`
      UPDATE materials
      SET
        name         = COALESCE(${data.name}, name),
        quantity     = COALESCE(${data.quantity}, quantity),
        observations = COALESCE(${data.observations}, observations)
      WHERE id = ${materialId}
        AND service_id = ${serviceId}
      RETURNING *
    `;
    return rows[0] || null;
  }

  /**
   * Remove um material de um serviço.
   */
  async deleteMaterial(serviceId: string, materialId: string): Promise<void> {
    await sql`
      DELETE FROM materials
      WHERE id = ${materialId}
        AND service_id = ${serviceId}
    `;
  }
}
