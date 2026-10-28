import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import { Driver, DriverStatus } from '../../types';
import {
  Users,
  Plus,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  Award,
  AlertTriangle,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';

export const DriversView: React.FC = () => {
  const { drivers, setIsAddDriverOpen, vehicles } = useFleet();
  const [search, setSearch] = useState('');
  const [selectedDriverDetail, setSelectedDriverDetail] = useState<Driver | null>(drivers[0] || null);

  const filteredDrivers = drivers.filter((d) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        (d.assignedVehicleReg && d.assignedVehicleReg.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'driving':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">Driving</span>;
      case 'available':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Available</span>;
      case 'break':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">On Break</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">Offline</span>;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Driver Management & Safety Scoring</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor telematics safety scores, harsh braking events, route compliance, and live availability.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddDriverOpen(true)}
          className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Driver</span>
        </motion.button>
      </motion.div>

      {/* Main Grid: Driver List on Left, Behavior Score Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Driver Roster List */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-neutral-400 ml-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search driver by name, license number, or vehicle..."
              className="w-full bg-transparent text-xs text-neutral-800 focus:outline-none"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDrivers.map((driver, idx) => {
              const isSelected = selectedDriverDetail?.id === driver.id;

              return (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.4) }}
                  whileHover={{ y: -3 }}
                  onClick={() => setSelectedDriverDetail(driver)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-black ring-2 ring-black/10 shadow-md'
                      : 'border-neutral-200 hover:border-neutral-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-neutral-200"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-neutral-900">{driver.name}</h3>
                        <div className="text-[11px] text-neutral-400 font-mono">{driver.licenseNumber}</div>
                      </div>
                    </div>
                    {getStatusBadge(driver.status)}
                  </div>

                  <div className="bg-[#f8fafc] p-2.5 rounded-2xl border border-neutral-100 flex items-center justify-between mb-3 text-xs">
                    <div>
                      <div className="text-[9px] text-neutral-400 uppercase font-semibold">Assigned Vehicle</div>
                      <div className="font-bold text-neutral-900 font-mono">
                        {driver.assignedVehicleReg || 'Unassigned'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-neutral-400 uppercase font-semibold">Trips Done</div>
                      <div className="font-bold text-neutral-900 font-mono">{driver.tripsCompleted}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{driver.safetyScore}/100 Score</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{driver.rating}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 2. Driver Behavior Scoring Detail Card */}
        {selectedDriverDetail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-md flex flex-col justify-between h-fit sticky top-6"
          >
            <div>
              <div className="text-center pb-4 border-b border-neutral-100">
                <img
                  src={selectedDriverDetail.avatar}
                  alt={selectedDriverDetail.name}
                  className="w-20 h-20 rounded-3xl object-cover mx-auto mb-2 border-2 border-neutral-200 shadow-sm"
                />
                <h2 className="font-extrabold text-lg text-neutral-900">{selectedDriverDetail.name}</h2>
                <div className="text-xs text-neutral-500 font-mono">{selectedDriverDetail.licenseNumber}</div>
                <div className="text-xs text-neutral-400 mt-1">
                  {selectedDriverDetail.phone} • {selectedDriverDetail.experienceYears} yrs experience
                </div>
              </div>

              {/* Circular Safety Score Widget */}
              <div className="my-6 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-neutral-100"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={selectedDriverDetail.safetyScore > 90 ? 'text-emerald-500' : 'text-amber-500'}
                      strokeDasharray={`${selectedDriverDetail.safetyScore}, 100`}
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black font-mono text-neutral-900">
                      {selectedDriverDetail.safetyScore}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase">/ 100</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider mt-2">
                  Driver Safety Score
                </div>
              </div>

              {/* Granular Behavior Metrics Breakdown */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-neutral-600 mb-1">
                    <span>Speeding Adherence</span>
                    <strong className="text-neutral-900">{Math.max(70, 100 - selectedDriverDetail.speedingEvents * 4)}/100</strong>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(70, 100 - selectedDriverDetail.speedingEvents * 4)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-600 mb-1">
                    <span>Braking Smoothness</span>
                    <strong className="text-neutral-900">{Math.max(65, 100 - selectedDriverDetail.harshBrakingEvents * 5)}/100</strong>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(65, 100 - selectedDriverDetail.harshBrakingEvents * 5)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-600 mb-1">
                    <span>Acceleration Discipline</span>
                    <strong className="text-neutral-900">{Math.max(75, 100 - selectedDriverDetail.accelerationEvents * 4)}/100</strong>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.max(75, 100 - selectedDriverDetail.accelerationEvents * 4)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-600 mb-1">
                    <span>Idling Efficiency ({selectedDriverDetail.idlingMinutes}m idle)</span>
                    <strong className="text-neutral-900">{Math.max(60, 100 - selectedDriverDetail.idlingMinutes)}/100</strong>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.max(60, 100 - selectedDriverDetail.idlingMinutes)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-600 mb-1">
                    <span>Route Adherence</span>
                    <strong className="text-neutral-900">{selectedDriverDetail.routeAdherenceScore}/100</strong>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedDriverDetail.routeAdherenceScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Performance Tier:</span>
              <span className="font-bold text-emerald-600 uppercase">Tier 1 Certified Master</span>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
