import { sql } from "../../db/client";
import type { DashboardStats, Service } from "../../types";

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const trucks = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM trucks`;
    const servicesThisMonth = await sql<{ count: number; total: number | null }[]>`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(value), 0) AS total
      FROM services
      WHERE date_trunc('month', service_date) = date_trunc('month', now())
    `;
    const pending = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM services WHERE status = 'PENDENTE'
    `;
    const recent = await sql<Service[]>`
      SELECT * FROM services ORDER BY service_date DESC LIMIT 5
    `;
    return {
      totalTrucks: trucks[0]?.count ?? 0,
      servicesThisMonth: servicesThisMonth[0]?.count ?? 0,
      valueThisMonth: Number(servicesThisMonth[0]?.total ?? 0),
      pendingServices: pending[0]?.count ?? 0,
      recentServices: recent
    };
  }
}
