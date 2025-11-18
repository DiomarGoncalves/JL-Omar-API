export interface User {
  id: string;
  username: string;
  name: string;
  email?: string | null;
  password_hash: string;
  created_at: Date;
}

export type ServiceStatus = "PENDENTE" | "CONCLUIDO";

export interface Truck {
  id: string;
  brand: string;
  model: string;
  year: number;
  observations?: string | null;
}

export interface Service {
  id: string;
  truck_id: string;
  equipment: string;
  service_date: string;
  of: string;
  meter: number;
  value: number;
  status: ServiceStatus;
  observations?: string | null;
}

export interface Material {
  id: string;
  service_id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface Measurement {
  id: string;
  truck_id: string;
  service_id?: string | null;
  measurement_date: string;
  technician: string;
  value_before: number;
  value_after: number;
  observations?: string | null;
}

export interface DashboardStats {
  totalTrucks: number;
  servicesThisMonth: number;
  valueThisMonth: number;
  pendingServices: number;
  recentServices: Service[];
}
