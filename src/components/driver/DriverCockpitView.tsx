import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  Truck,
  Gauge,
  Fuel,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  CheckCircle,
  Navigation,
  Phone,
  Radio,
  FileText,
  Thermometer,
  Disc,
  Activity,
  ArrowRight,
  Send
} from 'lucide-react';

export const DriverCockpitView: React.FC = () => {
  const {
    currentUser,
    vehicles,
    deliveries,
    updateDriverDutyStatus,
    updateDeliveryStatus,
    sendRemoteCommand,
    setActiveView
  } = useFleet();

  // Find assigned vehicle or fallback to first vehicle
  const assignedVehicle = vehicles.find(
    (v) => v.id === currentUser?.assignedVehicleId || v.registrationNumber === currentUser?.assignedVehicleReg
  ) || vehicles[0];

  // Find active deliveries for this vehicle
  const activeDeliveries = deliveries.filter(
    (d) => d.assignedVehicleId === assignedVehicle?.id && (d.status === 'in_transit' || d.status === 'assigned' || d.status === 'pending')
  );

  const [dvirChecked, setDvirChecked] = useState({
    brakes: true,
    tires: true,
    lights: true,
    oilLevel: true,
    cargoSecure: true
  });

  const [emergencySending, setEmergencySending] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const currentDuty = currentUser?.dutyStatus || 'driving';

  const handleDutyChange = async (status: 'available' | 'driving' | 'break' | 'offline') => {
    await updateDriverDutyStatus(status);
  };

  const handleTriggerSOS = async () => {
    setEmergencySending(true);
    if (assignedVehicle) {
      await sendRemoteCommand(assignedVehicle.id, 'horn');
    }
    setTimeout(() => {
      setEmergencySending(false);
      setSosSent(true);
      setTimeout(() => setSosSent(false), 6000);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Driver Identity & Live Status */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-black text-white p-6 md:p-8 rounded-3xl shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-950/30 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-400/40 p-0.5 bg-neutral-800 shadow-lg">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Driver'}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  COMMERCIAL DRIVER COCKPIT
                </span>
                {currentUser?.isGoogleLinked && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Google Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {currentUser?.name || 'Arun Kumar'}
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                <span>CDL: {currentUser?.driverLicense || 'TN-01-2018-0091823'}</span>
                <span>•</span>
                <span>{currentUser?.company || 'Singhania Heavy Logistics Corp'}</span>
              </p>
            </div>
          </div>

          {/* Real-time Duty Status Switcher */}
          <div className="bg-neutral-800/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-700/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2">
              DUTY STATUS:
            </span>
            <button
              onClick={() => handleDutyChange('driving')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentDuty === 'driving'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentDuty === 'driving' ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
              DRIVING
            </button>
            <button
              onClick={() => handleDutyChange('break')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentDuty === 'break'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-300" />
              ON BREAK
            </button>
            <button
              onClick={() => handleDutyChange('available')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentDuty === 'available'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              AVAILABLE
            </button>
            <button
              onClick={() => handleDutyChange('offline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentDuty === 'offline'
                  ? 'bg-neutral-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              OFF DUTY
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Assigned Vehicle Live Telemetry & HOS Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Assigned Vehicle Telematics */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  ASSIGNED ASSET
                </span>
                <h3 className="text-base font-extrabold text-neutral-900">
                  {assignedVehicle?.registrationNumber} • {assignedVehicle?.model}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setActiveView('tracking')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Open Live GPS Map
            </button>
          </div>

          {/* Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-100">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-semibold">Speed</span>
                <Gauge className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-black text-neutral-900 font-mono">
                {assignedVehicle?.speed || 0}
                <span className="text-xs font-normal text-neutral-400 ml-1">km/h</span>
              </div>
              <div className="mt-2 text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Under Speed Governor
              </div>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-100">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-semibold">Diesel Fuel</span>
                <Fuel className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-neutral-900 font-mono">
                {assignedVehicle?.fuelLevel || 74}%
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${assignedVehicle?.fuelLevel || 74}%` }}
                />
              </div>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-100">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-semibold">Engine Temp</span>
                <Thermometer className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-neutral-900 font-mono">
                {assignedVehicle?.engineTemp || 88}°C
              </div>
              <div className="mt-2 text-[10px] text-neutral-500 font-medium">
                Nominal 85° - 95°C
              </div>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-100">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-semibold">Tire Pressure</span>
                <Disc className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-neutral-900 font-mono">
                {assignedVehicle?.tirePressure || 110}
                <span className="text-xs font-normal text-neutral-400 ml-1">PSI</span>
              </div>
              <div className="mt-2 text-[10px] text-emerald-600 font-semibold">
                TPMS Calibrated
              </div>
            </div>
          </div>

          {/* Current Waypoint & Destination */}
          <div className="mt-6 p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  ACTIVE ROUTE WAYPOINT
                </span>
                <h4 className="text-sm font-bold text-white">
                  {assignedVehicle?.currentLocation?.address || 'Chennai Central Freight Corridor'}
                </h4>
                <p className="text-xs text-cyan-300">
                  Destination: {assignedVehicle?.destination || 'Sriperumbudur Auto Logistics Hub'} • ETA: {assignedVehicle?.etaMinutes || 24} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerSOS}
                disabled={emergencySending}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                {emergencySending ? 'Transmitting...' : sosSent ? 'SOS Dispatched!' : 'Driver SOS Alert'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Hours of Service (HOS) & Regulatory Compliance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-600" />
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  HOURS OF SERVICE (HOS)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                COMPLIANT
              </span>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-500 font-medium">Driving Time Remaining</span>
                  <span className="font-bold text-neutral-900 font-mono">5h 20m / 8h 00m</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-500 font-medium">Mandatory Break Due In</span>
                  <span className="font-bold text-amber-600 font-mono">42 minutes</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-500 font-medium">Weekly 60-Hour Cycle</span>
                  <span className="font-bold text-neutral-900 font-mono">32h 15m logged</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '53%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Trip Vehicle Inspection (DVIR) */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-2">
              Pre-Trip Inspection (DVIR):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(dvirChecked).map(([key, val]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-neutral-600">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => setDvirChecked({ ...dvirChecked, [key]: e.target.checked })}
                    className="rounded text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries & Dispatch Manifest for this Driver */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                DISPATCH MANIFEST
              </span>
              <h3 className="text-base font-extrabold text-neutral-900">
                Assigned Shipments & Stops Today
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-500">
            {activeDeliveries.length} Consignments Active
          </span>
        </div>

        <div className="divide-y divide-neutral-100 mt-2">
          {activeDeliveries.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No pending deliveries assigned for this vehicle right now. You are clear for dispatch!
            </div>
          ) : (
            activeDeliveries.map((del) => (
              <div key={del.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-neutral-900">{del.deliveryId}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                      {del.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-neutral-700">• {del.customer}</span>
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      Pickup: {del.pickup}
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1 font-medium text-neutral-800">
                      Drop: {del.destination}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Priority: <span className="uppercase font-semibold text-neutral-600">{del.priority}</span> • {del.itemsCount} pallets ({del.totalWeightKg ? `${del.totalWeightKg} kg` : 'Standard Load'})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {del.status === 'assigned' && (
                    <button
                      onClick={() => updateDeliveryStatus(del.id, 'in_transit')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Start Route
                    </button>
                  )}
                  {del.status === 'in_transit' && (
                    <button
                      onClick={() => updateDeliveryStatus(del.id, 'delivered')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Delivered (POD)
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
