import React from 'react';
import { Vehicle } from '../../types';
import {
  Gauge,
  Fuel,
  Thermometer,
  Battery,
  Disc,
  Calendar,
  User,
  ShieldCheck,
  Activity,
  Wrench,
  TrendingUp,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onTrackOnMap: (v: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose, onTrackOnMap }) => {
  if (!vehicle) return null;

  const historicalSpeedData = [
    { time: '08:00', speed: 45, temp: 82, fuel: 85 },
    { time: '09:00', speed: 65, temp: 86, fuel: 81 },
    { time: '10:00', speed: 58, temp: 88, fuel: 77 },
    { time: '11:00', speed: 72, temp: 91, fuel: 73 },
    { time: '12:00', speed: 30, temp: 84, fuel: 71 },
    { time: '13:00', speed: 62, temp: 88, fuel: 68 },
    { time: '14:00', speed: vehicle.speed, temp: vehicle.engineTemp, fuel: vehicle.fuelLevel },
  ];

  const maintenanceCostData = [
    { month: 'May', cost: 12500 },
    { month: 'Jun', cost: 4200 },
    { month: 'Jul', cost: 18900 },
    { month: 'Aug', cost: 31200 },
    { month: 'Sep', cost: 8400 },
    { month: 'Oct', cost: 14200 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-8">

        {/* Modal Header */}
        <div className="bg-neutral-900 text-white p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold font-mono tracking-wider">{vehicle.registrationNumber}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-white/20 text-white">
                {vehicle.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {vehicle.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {vehicle.model} ({vehicle.year}) • Assigned Driver: <strong className="text-white">{vehicle.driverName || 'Unassigned'}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-120px)]">

          {/* Truck Visual Asset Banner */}
          <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-900 group">
            <img
              src={
                vehicle.type === 'Van'
                  ? '/src/assets/images/delivery_fleet_van_1791043388354.jpg'
                  : vehicle.type === 'Truck'
                  ? '/src/assets/images/heavy_cargo_truck_1791043370930.jpg'
                  : '/src/assets/images/cyber_truck_hero_1791042836595.jpg'
              }
              alt={vehicle.model}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-300 uppercase">
                  CAN-BUS LINKED COMMERCIAL UNIT
                </span>
                <h3 className="text-white font-extrabold text-lg">{vehicle.model} ({vehicle.type})</h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                Odometer: {vehicle.mileage.toLocaleString()} km
              </span>
            </div>
          </div>

          {/* 1. Health Score Highlight Card */}
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Circular Health Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-neutral-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={vehicle.healthScore > 80 ? 'text-emerald-500' : 'text-amber-500'}
                    strokeDasharray={`${vehicle.healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-black font-mono text-neutral-900">{vehicle.healthScore}%</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Vehicle Health Score</div>
                <div className="text-lg font-bold text-neutral-900">
                  {vehicle.healthScore >= 85 ? 'EXCELLENT CONDITION' : vehicle.healthScore >= 70 ? 'GOOD CONDITION' : 'ATTENTION REQUIRED'}
                </div>
                <div className="text-xs text-neutral-500">
                  Predictive diagnosis: <strong className="text-neutral-800">{vehicle.predictedIssue || 'All telemetry nominal'}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTrackOnMap(vehicle)}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Track Live on Map</span>
            </button>
          </div>

          {/* 2. Live Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
              <Gauge className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Speed</div>
              <div className="text-base font-extrabold text-neutral-900 font-mono">{vehicle.speed} km/h</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
              <Fuel className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Fuel Level</div>
              <div className="text-base font-extrabold text-neutral-900 font-mono">{vehicle.fuelLevel}%</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
              <Thermometer className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Engine Temp</div>
              <div className="text-base font-extrabold text-neutral-900 font-mono">{vehicle.engineTemp}°C</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
              <Battery className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Battery</div>
              <div className="text-base font-extrabold text-neutral-900 font-mono">{vehicle.batteryVoltage} V</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
              <Activity className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Odometer</div>
              <div className="text-base font-extrabold text-neutral-900 font-mono">{vehicle.mileage.toLocaleString()} km</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 text-center">
              <Disc className="w-4 h-4 text-rose-600 mx-auto mb-1" />
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Tire Press.</div>
              <div className="text-base font-extrabold text-neutral-900 font-mono">{vehicle.tirePressure} PSI</div>
            </div>
          </div>

          {/* 3. Historical Telemetry Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Speed & Thermal Chart */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200">
              <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Today's Speed & Engine Temperature
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalSpeedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="speed" stroke="#2563eb" strokeWidth={2} name="Speed (km/h)" />
                    <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} name="Temp (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Maintenance Cost History */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200">
              <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                6-Month Maintenance Costs (₹)
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Cost (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4. Specifications and Next Service Info */}
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-neutral-400">Next Service Due:</span>
              <div className="font-bold text-neutral-900 mt-0.5">{vehicle.nextServiceDate}</div>
            </div>
            <div>
              <span className="text-neutral-400">Fuel Consumption:</span>
              <div className="font-bold text-neutral-900 mt-0.5">{vehicle.fuelConsumptionRate} L / 100km</div>
            </div>
            <div>
              <span className="text-neutral-400">Maintenance Risk:</span>
              <div className="font-bold text-neutral-900 mt-0.5">{vehicle.maintenanceRisk}% Index</div>
            </div>
            <div>
              <span className="text-neutral-400">Current Position:</span>
              <div className="font-bold text-neutral-900 mt-0.5 truncate">{vehicle.currentLocation.address}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
