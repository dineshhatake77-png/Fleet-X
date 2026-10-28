import { Vehicle, Driver, Route, Delivery, MaintenanceRecord, MaintenancePrediction, FuelRecord, Alert, FleetStats, User } from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_DELIVERIES,
  INITIAL_MAINTENANCE,
  INITIAL_PREDICTIONS,
  INITIAL_FUEL_RECORDS,
  INITIAL_ALERTS,
  INITIAL_USERS
} from '../data/seedData';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, options);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.warn(`API call to ${url} failed, using local in-memory fallback`, err);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
}

export const api = {
  // Stats
  getStats: () => fetchJson<FleetStats>('/stats', undefined, {
    totalVehicles: 128,
    activeVehicles: 94,
    inTransitVehicles: 64,
    maintenanceVehicles: 8,
    warningVehicles: 3,
    totalDrivers: 45,
    activeDrivers: 38,
    deliveriesToday: 342,
    completedDeliveriesToday: 315,
    onTimeRate: 94.2,
    fleetEfficiency: 92.4,
    totalFuelUsedLiters: 4820,
    totalFuelCost: 472360,
    avgConsumption: 14.2
  }),

  // Vehicles
  getVehicles: (query?: { status?: string; type?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.type) params.append('type', query.type);
    if (query?.search) params.append('search', query.search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<Vehicle[]>(`/vehicles${queryString}`, undefined, INITIAL_VEHICLES);
  },
  getVehicleById: (id: string) => fetchJson<Vehicle>(`/vehicles/${id}`, undefined, INITIAL_VEHICLES[0]),
  createVehicle: (data: Partial<Vehicle>) => fetchJson<Vehicle>('/vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateVehicle: (id: string, data: Partial<Vehicle>) => fetchJson<Vehicle>(`/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteVehicle: (id: string) => fetchJson<{ id: string }>(`/vehicles/${id}`, { method: 'DELETE' }),

  // Drivers
  getDrivers: () => fetchJson<Driver[]>('/drivers', undefined, INITIAL_DRIVERS),
  getDriverById: (id: string) => fetchJson<Driver>(`/drivers/${id}`, undefined, INITIAL_DRIVERS[0]),
  createDriver: (data: Partial<Driver>) => fetchJson<Driver>('/drivers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateDriver: (id: string, data: Partial<Driver>) => fetchJson<Driver>(`/drivers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Routes
  getRoutes: () => fetchJson<Route[]>('/routes', undefined, INITIAL_ROUTES),
  createRoute: (data: Partial<Route>) => fetchJson<Route>('/routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  optimizeRoute: (routeId: string) => fetchJson<any>('/routes/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeId })
  }),

  // Deliveries
  getDeliveries: () => fetchJson<Delivery[]>('/deliveries', undefined, INITIAL_DELIVERIES),
  createDelivery: (data: Partial<Delivery>) => fetchJson<Delivery>('/deliveries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateDelivery: (id: string, data: Partial<Delivery>) => fetchJson<Delivery>(`/deliveries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Maintenance
  getMaintenance: () => fetchJson<MaintenanceRecord[]>('/maintenance', undefined, INITIAL_MAINTENANCE),
  createMaintenance: (data: Partial<MaintenanceRecord>) => fetchJson<MaintenanceRecord>('/maintenance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  getPredictions: () => fetchJson<MaintenancePrediction[]>('/maintenance/predictions', undefined, INITIAL_PREDICTIONS),

  // Fuel
  getFuelRecords: () => fetchJson<FuelRecord[]>('/fuel', undefined, INITIAL_FUEL_RECORDS),
  getFuelAnalytics: () => fetchJson<any>('/fuel/analytics', undefined, {
    totalLiters: 4820,
    totalCost: 472360,
    avgEfficiency: 28.5,
    costPerKm: 8.42,
    fleetEfficiencyScore: 91,
    anomalies: [
      {
        vehicleId: 'VX-116',
        registrationNumber: 'TN 04 XZ 2211',
        model: 'Ashok Leyland 2820 Cargo',
        consumptionRate: 35.8,
        excessPercentage: 18,
        driverName: 'Unassigned',
        alert: 'Vehicle TN 04 XZ 2211 is consuming 18% more fuel than its fleet average'
      }
    ]
  }),
  createFuelRecord: (data: Partial<FuelRecord>) => fetchJson<FuelRecord>('/fuel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Alerts
  getAlerts: () => fetchJson<Alert[]>('/alerts', undefined, INITIAL_ALERTS),
  markAlertRead: (id: string) => fetchJson<Alert>(`/alerts/${id}/read`, { method: 'PUT' }),

  // Simulation Toggle
  toggleSimulation: (active: boolean) => fetchJson<{ isSimulationActive: boolean }>('/simulation/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active })
  }),

  // Auth
  login: (email: string, password: string) => fetchJson<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }, { user: INITIAL_USERS[0], token: 'demo-token' }),

  register: (data: any) => fetchJson<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};
