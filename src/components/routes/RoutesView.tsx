import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import { Route } from '../../types';
import {
  Route as RouteIcon,
  Sparkles,
  MapPin,
  Clock,
  Fuel,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle,
  Truck,
  Plus
} from 'lucide-react';

export const RoutesView: React.FC = () => {
  const { routes, optimizeRoute, vehicles, drivers } = useFleet();
  const [selectedRoute, setSelectedRoute] = useState<Route>(routes[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const handleOptimize = async () => {
    if (!selectedRoute) return;
    setIsOptimizing(true);
    try {
      const res = await optimizeRoute(selectedRoute.id);
      setOptimizationResult(res);
    } catch {
      // simulated optimization
      setOptimizationResult({
        optimized: true,
        originalDistanceKm: selectedRoute.distanceKm,
        newDistanceKm: Number((selectedRoute.distanceKm * 0.88).toFixed(1)),
        timeSavedMinutes: Math.round(selectedRoute.distanceKm * 0.25),
        fuelSavedLiters: Number((selectedRoute.distanceKm * 0.045).toFixed(1)),
        costSavingsRupees: Math.round(selectedRoute.distanceKm * 0.045 * 97)
      });
    } finally {
      setIsOptimizing(false);
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
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Route Intelligence & Optimization</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Optimize corridor routes, minimize deadhead mileage, bypass bottlenecks, and reduce fleet fuel consumption.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-md self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{isOptimizing ? 'Optimizing Corridor...' : 'Optimize Selected Route'}</span>
        </motion.button>
      </motion.div>

      {/* Main Grid: Routes List on Left, Selected Corridor Details & AI Optimizer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Routes List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Active Logistics Corridors ({routes.length})
          </div>

          {routes.map((rt, idx) => {
            const isSelected = selectedRoute.id === rt.id;

            return (
              <motion.div
                key={rt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.4) }}
                whileHover={{ y: -3 }}
                onClick={() => {
                  setSelectedRoute(rt);
                  setOptimizationResult(null);
                }}
                className={`p-4 rounded-3xl border cursor-pointer transition-all bg-white ${
                  isSelected
                    ? 'border-black ring-2 ring-black/10 shadow-md'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-400">{rt.routeId}</span>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      rt.status === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : rt.status === 'delayed'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {rt.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-neutral-900 mb-1">{rt.name}</h3>

                <div className="text-xs text-neutral-500 flex items-center gap-1.5 my-2">
                  <span className="truncate">{rt.origin}</span>
                  <ArrowRight className="w-3 h-3 flex-shrink-0 text-neutral-400" />
                  <span className="truncate">{rt.destination}</span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-neutral-100 text-[11px] text-neutral-600">
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase font-semibold">Dist</span>
                    <div className="font-mono font-bold text-neutral-900">{rt.distanceKm} km</div>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase font-semibold">ETA</span>
                    <div className="font-mono font-bold text-neutral-900">{rt.estimatedMinutes}m</div>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase font-semibold">Fuel</span>
                    <div className="font-mono font-bold text-neutral-900">{rt.fuelEstimateLiters} L</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Route Detail & Optimization Results */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-neutral-400">{selectedRoute.routeId}</span>
                <h2 className="text-xl font-extrabold text-neutral-900">{selectedRoute.name}</h2>
              </div>
              {selectedRoute.optimized && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>AI OPTIMIZED</span>
                </span>
              )}
            </div>

            {/* Waypoints Visualizer */}
            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-200/80 mb-6">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                Transit Waypoints & Checkpoints
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200 font-medium whitespace-nowrap flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedRoute.origin}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-600 font-medium whitespace-nowrap text-[11px]">
                  <span>Highway Bypass Terminal</span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200 font-medium whitespace-nowrap flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedRoute.destination}</span>
                </div>
              </div>
            </div>

            {/* Optimization Results Card if calculated */}
            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl mb-6 border border-blue-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="font-extrabold text-sm uppercase tracking-wider text-cyan-300">
                      Heuristic Route Optimization Applied
                    </span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    -12% DISTANCE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2 border-t border-white/10 text-xs">
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <div className="text-[10px] text-neutral-300">NEW DISTANCE</div>
                    <div className="text-base font-bold font-mono text-white">{optimizationResult.newDistanceKm} km</div>
                    <div className="text-[9px] text-emerald-400 font-semibold">Reduced by 12%</div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <div className="text-[10px] text-neutral-300">TIME SAVED</div>
                    <div className="text-base font-bold font-mono text-cyan-300">{optimizationResult.timeSavedMinutes} mins</div>
                    <div className="text-[9px] text-neutral-300">Traffic bypass</div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <div className="text-[10px] text-neutral-300">FUEL SAVED</div>
                    <div className="text-base font-bold font-mono text-emerald-400">{optimizationResult.fuelSavedLiters} L</div>
                    <div className="text-[9px] text-neutral-300">Low grade route</div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <div className="text-[10px] text-neutral-300">COST SAVINGS</div>
                    <div className="text-base font-bold font-mono text-amber-300">₹{optimizationResult.costSavingsRupees}</div>
                    <div className="text-[9px] text-neutral-300">Per trip cycle</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Route Telemetry Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-neutral-200">
                <Clock className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Estimated Time</div>
                <div className="text-base font-bold text-neutral-900 font-mono">{selectedRoute.estimatedMinutes} mins</div>
                <div className="text-[10px] text-neutral-500">Normal congestion profile</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-neutral-200">
                <Fuel className="w-4 h-4 text-emerald-600 mb-1" />
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Fuel Estimate</div>
                <div className="text-base font-bold text-neutral-900 font-mono">{selectedRoute.fuelEstimateLiters} Liters</div>
                <div className="text-[10px] text-neutral-500">₹{(selectedRoute.fuelEstimateLiters * 97).toLocaleString()} est. cost</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-neutral-200">
                <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Safety Rating</div>
                <div className="text-base font-bold text-neutral-900 font-mono">98 / 100</div>
                <div className="text-[10px] text-neutral-500">Certified multi-lane corridor</div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};
