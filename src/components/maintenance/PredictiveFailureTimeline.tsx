import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import { ComponentFailureForecast } from '../../types';
import { INITIAL_COMPONENT_FORECASTS } from '../../data/componentForecastData';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  Disc,
  Thermometer,
  Zap,
  Gauge,
  Flame,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  HelpCircle,
  Truck
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const PredictiveFailureTimeline: React.FC = () => {
  const { vehicles, addMaintenance } = useFleet();

  const [forecasts, setForecasts] = useState<ComponentFailureForecast[]>(INITIAL_COMPONENT_FORECASTS);
  const [selectedForecast, setSelectedForecast] = useState<ComponentFailureForecast>(INITIAL_COMPONENT_FORECASTS[0]);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [dutyCycleStress, setDutyCycleStress] = useState<'standard' | 'severe' | 'eco'>('standard');
  const [scheduledWorkOrders, setScheduledWorkOrders] = useState<{ [id: string]: boolean }>({});
  const [showToast, setShowToast] = useState<string | null>(null);

  // Compute stress multiplier
  const stressMultiplier = dutyCycleStress === 'severe' ? 0.65 : dutyCycleStress === 'eco' ? 1.25 : 1.0;

  // Filtered & adjusted forecasts
  const adjustedForecasts = useMemo(() => {
    return forecasts
      .map((f) => {
        const adjustedDays = Math.max(2, Math.round(f.estimatedFailureDays * stressMultiplier));
        let adjustedStatus: 'critical' | 'warning' | 'evaluate' | 'nominal' = 'nominal';
        let adjustedColor = '#10b981';

        if (adjustedDays <= 14) {
          adjustedStatus = 'critical';
          adjustedColor = '#ef4444';
        } else if (adjustedDays <= 30) {
          adjustedStatus = 'warning';
          adjustedColor = '#f59e0b';
        } else if (adjustedDays <= 60) {
          adjustedStatus = 'evaluate';
          adjustedColor = '#3b82f6';
        }

        return {
          ...f,
          estimatedFailureDays: adjustedDays,
          status: adjustedStatus,
          colorCode: adjustedColor,
          remainingDistanceKm: Math.round(f.remainingDistanceKm * stressMultiplier),
        };
      })
      .filter((f) => {
        if (selectedSubsystem !== 'all' && f.subsystem !== selectedSubsystem) return false;
        if (selectedVehicleId !== 'all' && f.vehicleId !== selectedVehicleId) return false;
        return true;
      })
      .sort((a, b) => a.estimatedFailureDays - b.estimatedFailureDays);
  }, [forecasts, stressMultiplier, selectedSubsystem, selectedVehicleId]);

  // Keep selected forecast synced with filtered results
  const currentSelected = useMemo(() => {
    return adjustedForecasts.find((f) => f.id === selectedForecast.id) || adjustedForecasts[0] || forecasts[0];
  }, [adjustedForecasts, selectedForecast]);

  // Count aggregates
  const counts = useMemo(() => {
    const critical = adjustedForecasts.filter((f) => f.status === 'critical').length;
    const warning = adjustedForecasts.filter((f) => f.status === 'warning').length;
    const evaluate = adjustedForecasts.filter((f) => f.status === 'evaluate').length;
    const nominal = adjustedForecasts.filter((f) => f.status === 'nominal').length;
    return { critical, warning, evaluate, nominal };
  }, [adjustedForecasts]);

  // Subsystem icon helper
  const getSubsystemIcon = (subsystem: string, className = 'w-4 h-4') => {
    switch (subsystem) {
      case 'Braking':
        return <Disc className={className} />;
      case 'Cooling':
        return <Thermometer className={className} />;
      case 'Electrical':
        return <Zap className={className} />;
      case 'Powertrain':
        return <Gauge className={className} />;
      case 'Fuel System':
        return <Flame className={className} />;
      case 'Transmission':
        return <Layers className={className} />;
      default:
        return <Wrench className={className} />;
    }
  };

  // Schedule action
  const handleScheduleOrder = (forecast: ComponentFailureForecast) => {
    addMaintenance({
      vehicleId: forecast.vehicleId,
      vehicleReg: forecast.vehicleReg,
      serviceType: `${forecast.subsystem} Overhaul - ${forecast.componentName}`,
      description: `Predictive maintenance triggered: ${forecast.recommendedAction} Telemetry driver: ${forecast.telemetryEvidence}`,
      cost: forecast.estimatedCost,
      date: new Date().toISOString().split('T')[0],
      mileage: 65000,
      technician: 'FleetX AI Predictive Bay',
      nextServiceDate: forecast.projectedFailureDate,
    });

    setScheduledWorkOrders((prev) => ({ ...prev, [forecast.id]: true }));
    setShowToast(`Work order successfully scheduled for ${forecast.vehicleReg} (${forecast.componentName})`);
    setTimeout(() => setShowToast(null), 3800);
  };

  // Degradation trajectory chart data (historical 30 days + forecast next 30 days)
  const trajectoryChartData = [
    { day: '-30d', wearA: 40, wearB: 25, threshold: 95 },
    { day: '-20d', wearA: 52, wearB: 34, threshold: 95 },
    { day: '-10d', wearA: 68, wearB: 48, threshold: 95 },
    { day: 'Today', wearA: currentSelected?.wearPercentage || 85, wearB: 60, threshold: 95 },
    { day: '+7d', wearA: Math.min(100, (currentSelected?.wearPercentage || 85) + 8), wearB: 68, threshold: 95 },
    { day: '+14d', wearA: Math.min(100, (currentSelected?.wearPercentage || 85) + 16), wearB: 76, threshold: 95 },
    { day: '+30d', wearA: 100, wearB: 88, threshold: 95 },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Dashboard Header & Subsystem Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-white p-5 md:p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-bold">
              CAN-BUS IOT SENSOR ANALYSIS
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Component Failure Forecasting Timeline
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Real-time mechanical degradation tracking utilizing engine CAN-bus telemetry, brake friction thermal cycles, and fuel pressure variance to forecast critical component exhaustion before failure occurs.
          </p>
        </div>

        {/* What-If Duty Cycle Stress Simulator Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 bg-[#f8fafc] p-2.5 rounded-2xl border border-neutral-200">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider pl-1">
            Simulate Stress:
          </span>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setDutyCycleStress('eco')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                dutyCycleStress === 'eco'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
              }`}
              title="Low payload highway cruise (-25% wear)"
            >
              Eco Cruise
            </button>
            <button
              onClick={() => setDutyCycleStress('standard')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                dutyCycleStress === 'standard'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
              }`}
              title="Standard fleet operation"
            >
              Baseline
            </button>
            <button
              onClick={() => setDutyCycleStress('severe')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                dutyCycleStress === 'severe'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
              }`}
              title="Heavy mountain gradient haul (+40% wear)"
            >
              Severe Mountain
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Color-Coded Timeline Horizon Bar (Core Feature) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-neutral-900 text-white p-6 md:p-8 rounded-3xl border border-neutral-800 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              CHRONOLOGICAL FAILURE HORIZON
            </span>
            <h3 className="text-lg md:text-xl font-extrabold tracking-tight mt-0.5">
              Predicted Component Exhaustion Window
            </h3>
          </div>

          {/* Color-Coded Legend Badges */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono font-bold">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              0–14D CRITICAL ({counts.critical})
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              15–30D WARNING ({counts.warning})
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              31–60D EVALUATE ({counts.evaluate})
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              60D+ NOMINAL ({counts.nominal})
            </span>
          </div>
        </div>

        {/* The Timeline Track Visualizer */}
        <div className="relative pt-8 pb-10 px-2 sm:px-4">
          {/* Base Colored Gradient Track */}
          <div className="h-3 w-full rounded-full bg-neutral-800 relative overflow-hidden flex shadow-inner">
            <div className="w-[16%] h-full bg-rose-500/80" title="0 to 14 Days: Critical Zone" />
            <div className="w-[18%] h-full bg-amber-500/80" title="15 to 30 Days: Warning Zone" />
            <div className="w-[33%] h-full bg-blue-500/70" title="31 to 60 Days: Evaluation Zone" />
            <div className="w-[33%] h-full bg-emerald-500/70" title="60 to 90+ Days: Nominal Envelope" />
          </div>

          {/* Time Marker Ticks below track */}
          <div className="relative w-full flex justify-between text-[10px] font-mono text-neutral-400 mt-3 pt-1 border-t border-neutral-800">
            <span>TODAY</span>
            <span>+7 DAYS</span>
            <span>+14 DAYS</span>
            <span>+30 DAYS</span>
            <span>+60 DAYS</span>
            <span>+90 DAYS+</span>
          </div>

          {/* Component Interactive Pins Positioned Chronologically on Timeline */}
          <div className="absolute top-2 left-2 right-2 sm:left-4 sm:right-4 h-12 pointer-events-none">
            {adjustedForecasts.map((forecast, idx) => {
              // Calculate horizontal position percentage (capped 0 to 90 days scale)
              const clampedDays = Math.min(90, Math.max(0, forecast.estimatedFailureDays));
              const leftPercent = (clampedDays / 90) * 96;
              const isSelected = currentSelected?.id === forecast.id;

              return (
                <motion.div
                  key={forecast.id}
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  style={{ left: `${leftPercent}%` }}
                  onClick={() => setSelectedForecast(forecast)}
                  className={`absolute top-0 -translate-x-1/2 cursor-pointer pointer-events-auto group z-20 transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                  title={`${forecast.componentName} (${forecast.estimatedFailureDays} days)`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-all ${
                      isSelected ? 'ring-4 ring-white/40' : ''
                    }`}
                    style={{
                      backgroundColor: forecast.colorCode,
                      borderColor: isSelected ? '#ffffff' : '#0f172a',
                    }}
                  >
                    {getSubsystemIcon(forecast.subsystem, 'w-3.5 h-3.5')}
                  </div>

                  {/* Tooltip on hover / selected */}
                  <div
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[9px] font-mono px-2 py-1 rounded-md border border-neutral-700 whitespace-nowrap shadow-xl pointer-events-none transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <strong>{forecast.estimatedFailureDays}d</strong>: {forecast.componentName.split(' ')[0]}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* 3. Drill-down: Selected Component Telemetry Radar & Historical Trajectory Chart */}
      {currentSelected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left 2 Cols: Detailed Component Analysis Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: currentSelected.colorCode }}
                    />
                    <span className="font-mono text-xs font-bold text-neutral-400">
                      {currentSelected.vehicleReg} ({currentSelected.vehicleModel})
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full font-mono ${
                        currentSelected.status === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : currentSelected.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : currentSelected.status === 'evaluate'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {currentSelected.urgencyLevel} PRIORITY
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-900">
                    {currentSelected.componentName}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Subsystem: <strong className="text-neutral-800">{currentSelected.subsystem}</strong> • ML Forecast Accuracy:{' '}
                    <strong className="text-emerald-600">{currentSelected.confidenceScore}%</strong>
                  </div>
                </div>

                {/* Days Countdown Callout */}
                <div className="text-left sm:text-right bg-[#f8fafc] sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                  <div
                    className="text-3xl font-black font-mono tracking-tight"
                    style={{ color: currentSelected.colorCode }}
                  >
                    {currentSelected.estimatedFailureDays} Days
                  </div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">
                    Estimated Time To Failure
                  </div>
                  <div className="text-[11px] font-mono text-neutral-600 mt-0.5">
                    ~{currentSelected.remainingDistanceKm.toLocaleString()} km remaining
                  </div>
                </div>
              </div>

              {/* Wear Gauge & Telemetry Evidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                {/* Wear Progress */}
                <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-neutral-600 uppercase text-[10px]">Mechanical Wear Index</span>
                    <span className="font-mono font-bold text-neutral-900">{currentSelected.wearPercentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentSelected.wearPercentage}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: currentSelected.colorCode }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-neutral-400 mt-1 font-mono">
                    <span>0% (New)</span>
                    <span className="text-rose-500 font-bold">95% (Failure Threshold)</span>
                  </div>
                </div>

                {/* Estimated Part & Labor Cost */}
                <div className="bg-[#f8fafc] p-4 rounded-2xl border border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-600 uppercase text-[10px]">Estimated Replacement</span>
                    <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5">
                      ₹{currentSelected.estimatedCost.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-neutral-400">OEM Genuine Part + Bay Labor</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-xs">
                    <Wrench className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>

              {/* CAN-Bus Telemetry Triggers Evidence */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Live Telemetry Anomaly Signature
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-mono">
                  {currentSelected.telemetryEvidence}
                </p>
                <div className="pt-2 border-t border-neutral-200/60 text-xs text-neutral-800">
                  <strong>Recommended Preventive Action:</strong> {currentSelected.recommendedAction}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-neutral-400">
                Target Intercept Date: <strong className="text-neutral-800">{currentSelected.projectedFailureDate}</strong>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleScheduleOrder(currentSelected)}
                disabled={scheduledWorkOrders[currentSelected.id]}
                className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
                  scheduledWorkOrders[currentSelected.id]
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-black hover:bg-neutral-800 text-white'
                }`}
              >
                {scheduledWorkOrders[currentSelected.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Work Order Dispatched</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" />
                    <span>Dispatch Maintenance Work Order</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Right Col: Degradation Trajectory Curve */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider">
                  Wear Trajectory Curve
                </h4>
                <span className="text-[10px] font-mono text-neutral-400">Heuristic ML Slope</span>
              </div>
              <p className="text-xs text-neutral-500 mb-4">
                Telemetry degradation rate intercepting catastrophic failure threshold (95%).
              </p>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trajectoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[20, 105]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                    <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Critical Failure Limit', fill: '#ef4444', fontSize: 9 }} />
                    <Line type="monotone" dataKey="wearA" stroke={currentSelected.colorCode} strokeWidth={3} dot={{ r: 4 }} name="Current Component" />
                    <Line type="monotone" dataKey="wearB" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" name="Nominal Baseline" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#f8fafc] p-3 rounded-2xl border border-neutral-100 text-[11px] text-neutral-600 mt-3 space-y-1">
              <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Predictive Intervention Advantage</span>
              </div>
              <p className="text-[10px] text-neutral-500">
                Servicing before intercept avoids roadside deadhead towing (₹35,000 avg) and prevents cascaded drivetrain damage.
              </p>
            </div>
          </motion.div>

        </div>
      )}

      {/* 4. Complete Component Roster Table / Grid with Filtering */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
              Fleet Component Reliability Roster ({adjustedForecasts.length})
            </h3>
          </div>

          {/* Subsystem Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Braking', 'Cooling', 'Powertrain', 'Electrical', 'Fuel System', 'Transmission'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubsystem(sub)}
                className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors text-[11px] ${
                  selectedSubsystem === sub
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {sub === 'all' ? 'All Subsystems' : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adjustedForecasts.map((f, idx) => {
            const isSelected = currentSelected?.id === f.id;

            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedForecast(f)}
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-black ring-2 ring-black/10 shadow-md bg-white'
                    : 'border-neutral-200 hover:border-neutral-300 bg-[#fafbfc]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: f.colorCode }}
                    />
                    <span className="text-[10px] font-mono font-bold text-neutral-500">{f.vehicleReg}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        f.status === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : f.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : f.status === 'evaluate'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {f.estimatedFailureDays}D ETA
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-neutral-900 line-clamp-1 mb-1">
                    {f.componentName}
                  </h4>
                  <div className="text-[10px] text-neutral-400 mb-3">{f.subsystem}</div>

                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-neutral-500">Wear Level</span>
                      <strong className="font-mono text-neutral-900">{f.wearPercentage}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${f.wearPercentage}%`, backgroundColor: f.colorCode }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 font-mono">₹{f.estimatedCost.toLocaleString()}</span>
                  <span className="text-blue-600 font-semibold flex items-center">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
