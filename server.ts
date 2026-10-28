import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_DELIVERIES,
  INITIAL_MAINTENANCE,
  INITIAL_FUEL_RECORDS,
  INITIAL_ALERTS,
  INITIAL_USERS,
  INITIAL_PREDICTIONS
} from './src/data/seedData';
import { Vehicle, Driver, Route, Delivery, MaintenanceRecord, FuelRecord, Alert, User, FleetStats } from './src/types';
import { calculateVehicleMaintenanceRisk, generateAllPredictions } from './src/services/predictiveEngine';
import { simulateVehicleTelemetryStep } from './src/services/gpsSimulator';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Data Collections (MERN-style persistent state during runtime)
let vehicles: Vehicle[] = [...INITIAL_VEHICLES];
let drivers: Driver[] = [...INITIAL_DRIVERS];
let routes: Route[] = [...INITIAL_ROUTES];
let deliveries: Delivery[] = [...INITIAL_DELIVERIES];
let maintenance: MaintenanceRecord[] = [...INITIAL_MAINTENANCE];
let fuelRecords: FuelRecord[] = [...INITIAL_FUEL_RECORDS];
let alerts: Alert[] = [...INITIAL_ALERTS];
let users: User[] = [...INITIAL_USERS];

let isSimulationActive = true;

// Active SSE Clients for real-time telemetry streaming
const sseClients: Response[] = [];

// Periodic Simulation Tick (every 3 seconds)
setInterval(() => {
  if (!isSimulationActive) return;
  vehicles = simulateVehicleTelemetryStep(vehicles);

  // Broadcast to all connected SSE clients
  const eventPayload = JSON.stringify({
    type: 'TELEMETRY_UPDATE',
    timestamp: new Date().toISOString(),
    vehicles: vehicles.map(v => ({
      id: v.id,
      vehicleId: v.vehicleId,
      registrationNumber: v.registrationNumber,
      lat: v.currentLocation.lat,
      lng: v.currentLocation.lng,
      speed: v.speed,
      fuelLevel: v.fuelLevel,
      engineTemp: v.engineTemp,
      status: v.status,
      heading: v.heading,
      etaMinutes: v.etaMinutes
    }))
  });

  sseClients.forEach((client, index) => {
    try {
      client.write(`data: ${eventPayload}\n\n`);
    } catch {
      sseClients.splice(index, 1);
    }
  });
}, 3000);

// Helper for consistent API response format
const apiSuccess = (res: Response, data: any, message = 'Success') => {
  res.json({ success: true, message, data });
};

const apiError = (res: Response, status = 400, message = 'An error occurred') => {
  res.status(status).json({ success: false, message });
};

/* -------------------------------------------------------------
 * 1. AUTHENTICATION REST APIS
 * -----------------------------------------------------------*/
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, company, role } = req.body;
  if (!name || !email || !password) {
    return apiError(res, 400, 'Name, email and password are required');
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return apiError(res, 400, 'User with this email already exists');
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'Fleet Manager',
    company: company || 'Fleet Operations Ltd',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
  };

  users.push(newUser);
  apiSuccess(res, { user: newUser, token: `jwt-demo-token-${newUser.id}` }, 'Registered successfully');
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    // Provide demo fallback login for any credentials
    const demoUser = users[0];
    return apiSuccess(res, { user: demoUser, token: `jwt-demo-token-${demoUser.id}` }, 'Logged in as Demo User');
  }

  apiSuccess(res, { user, token: `jwt-demo-token-${user.id}` }, 'Logged in successfully');
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  apiSuccess(res, { user: users[0] });
});

/* -------------------------------------------------------------
 * 2. VEHICLE REST APIS
 * -----------------------------------------------------------*/
app.get('/api/vehicles', (req: Request, res: Response) => {
  const { status, type, search } = req.query;
  let results = [...vehicles];

  if (status && status !== 'all') {
    results = results.filter(v => v.status === status);
  }
  if (type && type !== 'all') {
    results = results.filter(v => v.type === type);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(v =>
      v.registrationNumber.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      (v.driverName && v.driverName.toLowerCase().includes(q))
    );
  }

  apiSuccess(res, results);
});

app.get('/api/vehicles/:id', (req: Request, res: Response) => {
  const vehicle = vehicles.find(v => v.id === req.params.id || v.vehicleId === req.params.id);
  if (!vehicle) return apiError(res, 404, 'Vehicle not found');

  const risk = calculateVehicleMaintenanceRisk(vehicle);
  apiSuccess(res, { ...vehicle, maintenanceRiskAssessment: risk });
});

app.post('/api/vehicles', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.registrationNumber || !data.type || !data.model) {
    return apiError(res, 400, 'Registration number, type and model are required');
  }

  const newVehicle: Vehicle = {
    id: `veh-${Date.now()}`,
    vehicleId: `VX-${vehicles.length + 101}`,
    registrationNumber: data.registrationNumber,
    type: data.type,
    model: data.model,
    year: data.year || 2023,
    status: data.status || 'active',
    fuelLevel: data.fuelLevel || 100,
    mileage: data.mileage || 0,
    healthScore: 95,
    speed: 0,
    engineTemp: 85,
    batteryVoltage: data.type === 'Car' ? 390 : 24.2,
    tirePressure: data.type === 'Truck' ? 110 : 35,
    currentLocation: data.currentLocation || { lat: 13.0827, lng: 80.2707, address: 'Fleet Base Depot' },
    heading: 0,
    destination: data.destination,
    etaMinutes: 0,
    nextServiceDate: data.nextServiceDate || '2026-12-31',
    fuelConsumptionRate: data.fuelConsumptionRate || 22.5,
    maintenanceRisk: 15,
    predictedIssue: 'Optimal Condition'
  };

  vehicles.unshift(newVehicle);
  apiSuccess(res, newVehicle, 'Vehicle added successfully');
});

app.put('/api/vehicles/:id', (req: Request, res: Response) => {
  const index = vehicles.findIndex(v => v.id === req.params.id);
  if (index === -1) return apiError(res, 404, 'Vehicle not found');

  vehicles[index] = { ...vehicles[index], ...req.body };
  apiSuccess(res, vehicles[index], 'Vehicle updated');
});

app.delete('/api/vehicles/:id', (req: Request, res: Response) => {
  const initialLen = vehicles.length;
  vehicles = vehicles.filter(v => v.id !== req.params.id);
  if (vehicles.length === initialLen) return apiError(res, 404, 'Vehicle not found');
  apiSuccess(res, { id: req.params.id }, 'Vehicle deleted');
});

/* -------------------------------------------------------------
 * 3. DRIVERS REST APIS
 * -----------------------------------------------------------*/
app.get('/api/drivers', (req: Request, res: Response) => {
  apiSuccess(res, drivers);
});

app.get('/api/drivers/:id', (req: Request, res: Response) => {
  const driver = drivers.find(d => d.id === req.params.id);
  if (!driver) return apiError(res, 404, 'Driver not found');
  apiSuccess(res, driver);
});

app.post('/api/drivers', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.licenseNumber) {
    return apiError(res, 400, 'Name and license number are required');
  }

  const newDriver: Driver = {
    id: `drv-${Date.now()}`,
    name: data.name,
    email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@fleetx.io`,
    phone: data.phone || '+91 98400 00000',
    licenseNumber: data.licenseNumber,
    avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
    status: data.status || 'available',
    safetyScore: 92,
    speedingEvents: 0,
    harshBrakingEvents: 0,
    accelerationEvents: 0,
    idlingMinutes: 5,
    routeAdherenceScore: 98,
    tripsCompleted: 0,
    rating: 5.0,
    experienceYears: data.experienceYears || 3
  };

  drivers.unshift(newDriver);
  apiSuccess(res, newDriver, 'Driver created');
});

app.put('/api/drivers/:id', (req: Request, res: Response) => {
  const index = drivers.findIndex(d => d.id === req.params.id);
  if (index === -1) return apiError(res, 404, 'Driver not found');
  drivers[index] = { ...drivers[index], ...req.body };
  apiSuccess(res, drivers[index], 'Driver updated');
});

app.delete('/api/drivers/:id', (req: Request, res: Response) => {
  drivers = drivers.filter(d => d.id !== req.params.id);
  apiSuccess(res, { id: req.params.id }, 'Driver deleted');
});

/* -------------------------------------------------------------
 * 4. LIVE TRACKING REST APIS
 * -----------------------------------------------------------*/
app.get('/api/tracking', (req: Request, res: Response) => {
  const trackingData = vehicles.map(v => ({
    vehicleId: v.vehicleId,
    id: v.id,
    registrationNumber: v.registrationNumber,
    type: v.type,
    model: v.model,
    driverName: v.driverName || 'Unassigned',
    status: v.status,
    speed: v.speed,
    fuelLevel: v.fuelLevel,
    heading: v.heading,
    etaMinutes: v.etaMinutes || 0,
    destination: v.destination || 'Depot Terminal',
    currentLocation: v.currentLocation
  }));
  apiSuccess(res, trackingData);
});

app.get('/api/tracking/:vehicleId', (req: Request, res: Response) => {
  const vehicle = vehicles.find(v => v.id === req.params.vehicleId || v.vehicleId === req.params.vehicleId);
  if (!vehicle) return apiError(res, 404, 'Vehicle not found');
  apiSuccess(res, vehicle);
});

/* -------------------------------------------------------------
 * 5. ROUTES & OPTIMIZER REST APIS
 * -----------------------------------------------------------*/
app.get('/api/routes', (req: Request, res: Response) => {
  apiSuccess(res, routes);
});

app.post('/api/routes', (req: Request, res: Response) => {
  const data = req.body;
  const newRoute: Route = {
    id: `rt-${Date.now()}`,
    routeId: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
    name: data.name || `${data.origin} to ${data.destination}`,
    origin: data.origin,
    originCoord: data.originCoord || { lat: 13.0827, lng: 80.2707 },
    destination: data.destination,
    destCoord: data.destCoord || { lat: 12.9716, lng: 77.5946 },
    distanceKm: data.distanceKm || 50,
    estimatedMinutes: data.estimatedMinutes || 60,
    vehicleId: data.vehicleId || vehicles[0].id,
    driverId: data.driverId || drivers[0].id,
    status: 'planned',
    waypoints: data.waypoints || [],
    fuelEstimateLiters: Number(((data.distanceKm || 50) * 0.22).toFixed(1)),
    optimized: false
  };
  routes.unshift(newRoute);
  apiSuccess(res, newRoute, 'Route planned');
});

app.post('/api/routes/optimize', (req: Request, res: Response) => {
  const { routeId, avoidTolls, prioritizeFuel } = req.body;
  const targetRoute = routes.find(r => r.id === routeId || r.routeId === routeId);

  const originalDistance = targetRoute ? targetRoute.distanceKm : 120;
  const optimizedDistance = Number((originalDistance * 0.88).toFixed(1));
  const timeSavedMinutes = Math.round(originalDistance * 0.25);
  const fuelSavedLiters = Number((originalDistance * 0.045).toFixed(1));

  if (targetRoute) {
    targetRoute.optimized = true;
    targetRoute.distanceKm = optimizedDistance;
    targetRoute.estimatedMinutes = Math.max(15, targetRoute.estimatedMinutes - timeSavedMinutes);
  }

  apiSuccess(res, {
    optimized: true,
    originalDistanceKm: originalDistance,
    newDistanceKm: optimizedDistance,
    distanceReductionKm: Number((originalDistance - optimizedDistance).toFixed(1)),
    timeSavedMinutes,
    fuelSavedLiters,
    trafficDelayAvoidedMinutes: 18,
    costSavingsRupees: Math.round(fuelSavedLiters * 97)
  }, 'Route optimized with AI heuristic algorithm');
});

/* -------------------------------------------------------------
 * 6. DELIVERIES REST APIS
 * -----------------------------------------------------------*/
app.get('/api/deliveries', (req: Request, res: Response) => {
  apiSuccess(res, deliveries);
});

app.post('/api/deliveries', (req: Request, res: Response) => {
  const data = req.body;
  const newDelivery: Delivery = {
    id: `del-${Date.now()}`,
    deliveryId: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: data.customer,
    pickup: data.pickup,
    destination: data.destination,
    assignedVehicleId: data.assignedVehicleId || vehicles[0].id,
    vehicleReg: data.vehicleReg || vehicles[0].registrationNumber,
    driverId: data.driverId || drivers[0].id,
    driverName: data.driverName || drivers[0].name,
    expectedDelivery: data.expectedDelivery || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    status: 'assigned',
    itemsCount: data.itemsCount || 10,
    totalWeightKg: data.totalWeightKg || 500,
    priority: data.priority || 'normal',
    timeline: [
      { status: 'pending', label: 'Order Created', timestamp: 'Just now', completed: true },
      { status: 'assigned', label: 'Vehicle Assigned', timestamp: 'Just now', completed: true },
      { status: 'in_transit', label: 'Picked Up & En Route', timestamp: 'Pending', completed: false },
      { status: 'delivered', label: 'Delivered', timestamp: 'Pending', completed: false }
    ]
  };

  deliveries.unshift(newDelivery);
  apiSuccess(res, newDelivery, 'Delivery created');
});

app.put('/api/deliveries/:id', (req: Request, res: Response) => {
  const index = deliveries.findIndex(d => d.id === req.params.id);
  if (index === -1) return apiError(res, 404, 'Delivery not found');

  deliveries[index] = { ...deliveries[index], ...req.body };
  apiSuccess(res, deliveries[index], 'Delivery updated');
});

/* -------------------------------------------------------------
 * 7. PREDICTIVE MAINTENANCE REST APIS
 * -----------------------------------------------------------*/
app.get('/api/maintenance', (req: Request, res: Response) => {
  apiSuccess(res, maintenance);
});

app.post('/api/maintenance', (req: Request, res: Response) => {
  const data = req.body;
  const newRecord: MaintenanceRecord = {
    id: `mnt-${Date.now()}`,
    vehicleId: data.vehicleId,
    vehicleReg: data.vehicleReg,
    serviceType: data.serviceType,
    description: data.description || 'Scheduled Maintenance Order',
    date: data.date || new Date().toISOString().split('T')[0],
    mileage: data.mileage || 50000,
    cost: Number(data.cost) || 15000,
    technician: data.technician || 'Central Workshop Tech',
    status: data.status || 'Scheduled',
    nextServiceDate: data.nextServiceDate || '2026-12-15',
    partsReplaced: data.partsReplaced || []
  };

  maintenance.unshift(newRecord);
  apiSuccess(res, newRecord, 'Maintenance record created');
});

app.get('/api/maintenance/predictions', (req: Request, res: Response) => {
  const predictions = generateAllPredictions(vehicles);
  apiSuccess(res, predictions);
});

/* -------------------------------------------------------------
 * 8. FUEL REST APIS & ANALYTICS
 * -----------------------------------------------------------*/
app.get('/api/fuel', (req: Request, res: Response) => {
  apiSuccess(res, fuelRecords);
});

app.post('/api/fuel', (req: Request, res: Response) => {
  const data = req.body;
  const newRecord: FuelRecord = {
    id: `f-${Date.now()}`,
    vehicleId: data.vehicleId,
    vehicleReg: data.vehicleReg,
    liters: Number(data.liters),
    cost: Number(data.cost),
    mileage: Number(data.mileage),
    date: data.date || new Date().toISOString().split('T')[0],
    efficiencyL100km: Number(data.efficiencyL100km) || 28.5
  };
  fuelRecords.unshift(newRecord);
  apiSuccess(res, newRecord, 'Fuel log recorded');
});

app.get('/api/fuel/analytics', (req: Request, res: Response) => {
  const totalLiters = fuelRecords.reduce((acc, curr) => acc + curr.liters, 0);
  const totalCost = fuelRecords.reduce((acc, curr) => acc + curr.cost, 0);
  const avgEfficiency = (fuelRecords.reduce((acc, curr) => acc + curr.efficiencyL100km, 0) / (fuelRecords.length || 1)).toFixed(1);

  // High consumption anomalies (any vehicle consuming > 15% above fleet average)
  const avgNumber = parseFloat(avgEfficiency);
  const anomalies = vehicles
    .filter(v => v.fuelConsumptionRate > avgNumber * 1.15 && v.fuelConsumptionRate > 0)
    .map(v => ({
      vehicleId: v.vehicleId,
      registrationNumber: v.registrationNumber,
      model: v.model,
      consumptionRate: v.fuelConsumptionRate,
      excessPercentage: Math.round(((v.fuelConsumptionRate - avgNumber) / avgNumber) * 100),
      driverName: v.driverName || 'Unassigned',
      alert: `Vehicle ${v.registrationNumber} is consuming ${Math.round(((v.fuelConsumptionRate - avgNumber) / avgNumber) * 100)}% more fuel than fleet baseline`
    }));

  apiSuccess(res, {
    totalLiters,
    totalCost,
    avgEfficiency: Number(avgEfficiency),
    costPerKm: 8.42,
    fleetEfficiencyScore: 91,
    anomalies
  });
});

/* -------------------------------------------------------------
 * 9. ALERTS REST APIS
 * -----------------------------------------------------------*/
app.get('/api/alerts', (req: Request, res: Response) => {
  apiSuccess(res, alerts);
});

app.put('/api/alerts/:id/read', (req: Request, res: Response) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (alert) alert.isRead = true;
  apiSuccess(res, alert, 'Alert marked as read');
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const newAlert: Alert = {
    id: `alt-${Date.now()}`,
    type: req.body.type || 'engine_overheat',
    severity: req.body.severity || 'warning',
    message: req.body.message,
    timestamp: 'Just now',
    isRead: false,
    vehicleReg: req.body.vehicleReg,
    driverName: req.body.driverName
  };
  alerts.unshift(newAlert);
  apiSuccess(res, newAlert, 'Alert generated');
});

/* -------------------------------------------------------------
 * 10. FLEET KPI STATS REST API
 * -----------------------------------------------------------*/
app.get('/api/stats', (req: Request, res: Response) => {
  const stats: FleetStats = {
    totalVehicles: 128, // Fleet scale aggregate
    activeVehicles: vehicles.filter(v => v.status === 'active' || v.status === 'in_transit').length * 7 + 10,
    inTransitVehicles: vehicles.filter(v => v.status === 'in_transit').length * 8,
    maintenanceVehicles: 8,
    warningVehicles: vehicles.filter(v => v.status === 'warning' || v.status === 'critical').length,
    totalDrivers: 45,
    activeDrivers: 38,
    deliveriesToday: 342,
    completedDeliveriesToday: 315,
    onTimeRate: 94.2,
    fleetEfficiency: 92.4,
    totalFuelUsedLiters: 4820,
    totalFuelCost: 472360,
    avgConsumption: 14.2
  };
  apiSuccess(res, stats);
});

/* -------------------------------------------------------------
 * 11. REAL-TIME SERVER-SENT EVENTS (SSE) STREAM
 * -----------------------------------------------------------*/
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connection handshake
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'FleetX Real-time Telemetry Stream Connected' })}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

app.post('/api/simulation/toggle', (req: Request, res: Response) => {
  isSimulationActive = req.body.active !== undefined ? req.body.active : !isSimulationActive;
  apiSuccess(res, { isSimulationActive }, `Simulation ${isSimulationActive ? 'Activated' : 'Paused'}`);
});

/* -------------------------------------------------------------
 * VITE SPA INTEGRATION (Dev & Production)
 * -----------------------------------------------------------*/
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FleetX Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
