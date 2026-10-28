import { Vehicle, MaintenancePrediction } from '../types';

export interface MaintenanceRiskAssessment {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictedIssue: string;
  estimatedDays: number;
  factors: string[];
}

/**
 * Rule-Based Predictive Maintenance Engine
 * Designed with modular heuristic architecture ready for plug-and-play ML inference.
 */
export function calculateVehicleMaintenanceRisk(vehicle: Vehicle): MaintenanceRiskAssessment {
  let riskScore = 15; // baseline calibration
  const factors: string[] = [];
  let predictedIssue = 'Routine Wear & Tear';
  let estimatedDays = 45;

  // Rule 1: Mileage threshold analysis
  if (vehicle.mileage > 150000) {
    riskScore += 35;
    factors.push(`Severe high mileage (${vehicle.mileage.toLocaleString()} km) exceeds major overhaul limit (+35%)`);
    predictedIssue = 'Transmission & Differential Overhaul';
    estimatedDays = Math.min(estimatedDays, 7);
  } else if (vehicle.mileage > 100000) {
    riskScore += 25;
    factors.push(`High mileage (${vehicle.mileage.toLocaleString()} km) approaching tertiary service cycle (+25%)`);
    if (predictedIssue === 'Routine Wear & Tear') predictedIssue = 'Suspension & Bushings Wear';
    estimatedDays = Math.min(estimatedDays, 14);
  } else if (vehicle.mileage > 60000) {
    riskScore += 15;
    factors.push(`Mid-tier mileage (${vehicle.mileage.toLocaleString()} km) (+15%)`);
    estimatedDays = Math.min(estimatedDays, 25);
  }

  // Rule 2: Engine Operating Temperature Heuristic
  if (vehicle.engineTemp >= 100) {
    riskScore += 30;
    factors.push(`Engine thermal stress critical (${vehicle.engineTemp}°C vs nominal 85-90°C) (+30%)`);
    predictedIssue = 'Radiator Core Leak & Head Gasket Alert';
    estimatedDays = Math.min(estimatedDays, 3);
  } else if (vehicle.engineTemp >= 95) {
    riskScore += 18;
    factors.push(`Engine operating above optimal thermal range (${vehicle.engineTemp}°C) (+18%)`);
    if (!predictedIssue.includes('Radiator')) predictedIssue = 'Cooling Thermostat & Water Pump Flow';
    estimatedDays = Math.min(estimatedDays, 10);
  }

  // Rule 3: Vehicle Age Heuristic
  const currentYear = 2026;
  const age = currentYear - vehicle.year;
  if (age >= 5) {
    riskScore += 15;
    factors.push(`Chassis age (${age} years) causes metal fatigue and rubber degradation (+15%)`);
  } else if (age >= 3) {
    riskScore += 8;
    factors.push(`Fleet age (${age} years) (+8%)`);
  }

  // Rule 4: Health Score Inversion Check
  if (vehicle.healthScore < 70) {
    riskScore += 20;
    factors.push(`Composite telematics health index depleted (${vehicle.healthScore}%) (+20%)`);
    estimatedDays = Math.min(estimatedDays, 5);
  } else if (vehicle.healthScore < 85) {
    riskScore += 10;
    factors.push(`Composite health sub-optimal (${vehicle.healthScore}%) (+10%)`);
  }

  // Rule 5: Status Check
  if (vehicle.status === 'maintenance') {
    riskScore = Math.max(riskScore, 85);
    predictedIssue = 'Currently in Service Workshop Bay';
    estimatedDays = 1;
    factors.push('Active work order in progress at central depot');
  } else if (vehicle.status === 'critical') {
    riskScore = Math.max(riskScore, 88);
    predictedIssue = 'Immediate Safety Hazard Detected';
    estimatedDays = 2;
    factors.push('Telemetry warning sensors triggered emergency triage');
  } else if (vehicle.status === 'warning') {
    riskScore = Math.max(riskScore, 65);
    estimatedDays = Math.min(estimatedDays, 7);
    factors.push('Warning indicator flag raised');
  }

  // Cap risk score at 99 max and clamp min at 10
  riskScore = Math.min(99, Math.max(10, riskScore));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (riskScore >= 80) {
    riskLevel = 'CRITICAL';
  } else if (riskScore >= 65) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
  }

  if (factors.length === 0) {
    factors.push('All diagnostic parameters within certified OEM bounds');
    predictedIssue = 'None - Normal Operating Schedule';
  }

  return {
    riskScore,
    riskLevel,
    predictedIssue,
    estimatedDays,
    factors
  };
}

export function generateAllPredictions(vehicles: Vehicle[]): MaintenancePrediction[] {
  return vehicles.map(v => {
    const assessment = calculateVehicleMaintenanceRisk(v);
    return {
      vehicleId: v.id,
      vehicleReg: v.registrationNumber,
      model: v.model,
      mileage: v.mileage,
      riskScore: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      predictedIssue: assessment.predictedIssue,
      estimatedServiceDays: assessment.estimatedDays,
      contributingFactors: assessment.factors
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}
