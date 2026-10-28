import { Vehicle } from '../types';

/**
 * GPS Telemetry Simulation
 * Gradually nudges vehicle coordinates along their simulated travel vectors,
 * updates speeds realistically, decrements fuel proportionally, and updates ETAs.
 */
export function simulateVehicleTelemetryStep(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.map(vehicle => {
    // If vehicle is in maintenance or offline, keep it parked
    if (vehicle.status === 'maintenance' || vehicle.status === 'offline') {
      return { ...vehicle, speed: 0 };
    }

    // Small coordinate jitter/drift simulating travel along South India corridors
    const speedVariation = (Math.random() - 0.48) * 4; // slight acceleration / deceleration
    let newSpeed = Math.max(25, Math.min(85, Math.round(vehicle.speed + speedVariation)));
    if (vehicle.type === 'Bus') newSpeed = Math.min(60, newSpeed);
    if (vehicle.type === 'Truck') newSpeed = Math.min(68, newSpeed);

    // Coordinate step (approx 0.001 deg ~ 110 meters)
    const latDrift = (Math.random() - 0.49) * 0.002;
    const lngDrift = (Math.random() - 0.49) * 0.002;

    const newLat = Number((vehicle.currentLocation.lat + latDrift).toFixed(5));
    const newLng = Number((vehicle.currentLocation.lng + lngDrift).toFixed(5));

    // Slight fuel consumption
    let newFuel = vehicle.fuelLevel;
    if (Math.random() > 0.6) {
      newFuel = Math.max(5, Number((vehicle.fuelLevel - 0.1).toFixed(1)));
    }

    // Engine temperature subtle oscillation
    let newTemp = vehicle.engineTemp;
    if (vehicle.status === 'critical') {
      newTemp = Math.min(108, Math.max(99, vehicle.engineTemp + (Math.random() - 0.5) * 1.5));
    } else {
      newTemp = Math.min(94, Math.max(82, vehicle.engineTemp + (Math.random() - 0.5) * 0.8));
    }

    // Update ETA countdown
    let eta = vehicle.etaMinutes ? Math.max(1, vehicle.etaMinutes - 1) : 15;
    if (eta === 1 && Math.random() > 0.7) {
      eta = Math.floor(Math.random() * 30) + 15; // route cycle reset
    }

    // Heading calculation based on drift
    const heading = Math.round((vehicle.heading + (Math.random() - 0.5) * 8 + 360) % 360);

    return {
      ...vehicle,
      speed: newSpeed,
      engineTemp: Number(newTemp.toFixed(1)),
      fuelLevel: newFuel,
      etaMinutes: eta,
      heading,
      currentLocation: {
        ...vehicle.currentLocation,
        lat: newLat,
        lng: newLng,
      }
    };
  });
}
