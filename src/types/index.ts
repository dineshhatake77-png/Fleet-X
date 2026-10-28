export type VehicleStatus = 'active' | 'in_transit' | 'warning' | 'critical' | 'maintenance' | 'offline';
export type VehicleType = 'Truck' | 'Van' | 'Car' | 'Bus' | 'Pickup';
export type DriverStatus = 'available' | 'driving' | 'break' | 'offline';
export type RouteStatus = 'active' | 'planned' | 'completed' | 'delayed';
export type DeliveryStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type UserRole = 'Owner' | 'Driver' | 'Fleet Manager' | 'Admin' | 'Dispatcher' | 'Maintenance Manager';

export interface LocationCoordinate {
  lat: number;
  lng: number;
  address?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'terminal' | 'warehouse' | 'restricted' | 'depot';
  center: LocationCoordinate;
  radiusMeters: number;
  activeVehiclesCount: number;
  speedLimitKmH: number;
}

export interface DiagnosticCode {
  code: string;
  system: string;
  description: string;
  severity: 'minor' | 'moderate' | 'critical';
  timestamp: string;
}

export interface Vehicle {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  type: VehicleType;
  model: string;
  year: number;
  driverId?: string;
  driverName?: string;
  status: VehicleStatus;
  fuelLevel: number; // percentage 0-100
  mileage: number; // in km
  healthScore: number; // 0-100
  speed: number; // km/h
  engineTemp: number; // in Celsius
  batteryVoltage: number; // in Volts
  tirePressure: number; // PSI
  currentLocation: LocationCoordinate;
  heading: number; // degrees 0-360
  destination?: string;
  etaMinutes?: number;
  nextServiceDate: string;
  fuelConsumptionRate: number; // L / 100km
  maintenanceRisk: number; // 0-100 calculated
  predictedIssue?: string;
  routeId?: string;
  // Remote Control & Telematics Extensions
  isEngineImmobilized?: boolean;
  speedGovernorLimit?: number; // km/h (e.g. 60 or 80)
  isDoorLocked?: boolean;
  rpm?: number;
  fuelRailPressureBar?: number;
  co2EmissionsKgPerKm?: number;
  diagnosticCodes?: DiagnosticCode[];
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  avatar: string;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  status: DriverStatus;
  safetyScore: number; // 0-100
  speedingEvents: number;
  harshBrakingEvents: number;
  accelerationEvents: number;
  idlingMinutes: number;
  routeAdherenceScore: number;
  tripsCompleted: number;
  rating: number;
  experienceYears: number;
  // ELD / HOS Compliance
  hosDrivingMinutesToday?: number;
  hosMaxDrivingMinutes?: number;
  hosNextBreakDueMinutes?: number;
}

export interface Route {
  id: string;
  routeId: string;
  name: string;
  origin: string;
  originCoord: LocationCoordinate;
  destination: string;
  destCoord: LocationCoordinate;
  distanceKm: number;
  estimatedMinutes: number;
  actualMinutes?: number;
  vehicleId: string;
  driverId: string;
  status: RouteStatus;
  waypoints: LocationCoordinate[];
  fuelEstimateLiters: number;
  optimized: boolean;
  co2ReductionKg?: number;
}

export interface Delivery {
  id: string;
  deliveryId: string;
  customer: string;
  pickup: string;
  destination: string;
  assignedVehicleId: string;
  vehicleReg: string;
  driverId: string;
  driverName: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: DeliveryStatus;
  itemsCount: number;
  totalWeightKg: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timeline: {
    status: DeliveryStatus;
    label: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  serviceType: string;
  description: string;
  date: string;
  mileage: number;
  cost: number;
  technician: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  nextServiceDate: string;
  partsReplaced?: string[];
}

export interface MaintenancePrediction {
  vehicleId: string;
  vehicleReg: string;
  model: string;
  mileage: number;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictedIssue: string;
  estimatedServiceDays: number;
  contributingFactors: string[];
}

export interface ComponentFailureForecast {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  vehicleModel: string;
  componentName: string;
  subsystem: 'Braking' | 'Cooling' | 'Powertrain' | 'Electrical' | 'Fuel System' | 'Transmission';
  wearPercentage: number; // 0-100%
  healthScore: number; // 100-0%
  estimatedFailureDays: number;
  remainingDistanceKm: number;
  confidenceScore: number; // percentage
  status: 'critical' | 'warning' | 'evaluate' | 'nominal';
  colorCode: string; // hex
  telemetryEvidence: string;
  recommendedAction: string;
  estimatedCost: number;
  projectedFailureDate: string;
  urgencyLevel: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  liters: number;
  cost: number;
  mileage: number;
  date: string;
  efficiencyL100km: number;
}

export interface Alert {
  id: string;
  type: 'engine_overheat' | 'breakdown' | 'speeding' | 'maintenance_due' | 'low_fuel' | 'route_deviation' | 'high_idle' | 'delivery_done' | 'vehicle_assigned' | 'geofence_breach' | 'remote_command';
  severity: AlertSeverity;
  vehicleId?: string;
  vehicleReg?: string;
  driverId?: string;
  driverName?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  avatar?: string;
  phone?: string;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  driverLicense?: string;
  dutyStatus?: 'available' | 'driving' | 'break' | 'offline';
  isGoogleLinked?: boolean;
}

export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  inTransitVehicles: number;
  maintenanceVehicles: number;
  warningVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  deliveriesToday: number;
  completedDeliveriesToday: number;
  onTimeRate: number; // percentage
  fleetEfficiency: number; // percentage
  totalFuelUsedLiters: number;
  totalFuelCost: number;
  avgConsumption: number;
  carbonSavedKg?: number;
  geofenceEventsToday?: number;
}
