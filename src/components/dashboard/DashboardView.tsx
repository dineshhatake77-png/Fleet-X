import React from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import {
  Truck,
  Users,
  Package,
  Wrench,
  Fuel,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Globe2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    stats,
    vehicles,
    drivers,
    alerts,
    predictions,
    setActiveView,
    setSelectedVehicle,
    currentUser,
    setMapProvider
  } = useFleet();

  const performanceData = [
    { time: '06:00', active: 45, fuel: 820, efficiency: 94 },
    { time: '08:00', active: 78, fuel: 1450, efficiency: 91 },
    { time: '10:00', active: 94, fuel: 2100, efficiency: 92 },
    { time: '12:00', active: 90, fuel: 2800, efficiency: 89 },
    { time: '14:00', active: 92, fuel: 3400, efficiency: 93 },
    { time: '16:00', active: 88, fuel: 4100, efficiency: 90 },
    { time: '18:00', active: 65, fuel: 4600, efficiency: 95 },
  ];

  const kpis = [
    {
      title: 'TOTAL VEHICLES',
      value: stats?.totalVehicles || 128,
      trend: '+4%',
      isPositive: true,
      sub: 'Fleet capacity',
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      onClick: () => setActiveView('vehicles')
    },
    {
      title: 'ACTIVE',
      value: vehicles.filter(v => v.status === 'active' || v.status === 'in_transit').length * 7 + 10,
      trend: '+12%',
      isPositive: true,
      sub: 'Online telematics',
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      onClick: () => setActiveView('tracking')
    },
    {
      title: 'IN TRANSIT',
      value: 64,
      trend: '+8%',
      isPositive: true,
      sub: 'Cargo moving',
      icon: <MapPin className="w-5 h-5 text-cyan-600" />,
      onClick: () => setActiveView('tracking')
    },
    {
      title: 'MAINTENANCE',
      value: 8,
      trend: '-2%',
      isPositive: false,
      sub: 'Service bays',
      icon: <Wrench className="w-5 h-5 text-amber-600" />,
      onClick: () => setActiveView('maintenance')
    },
    {
      title: 'TOTAL DRIVERS',
      value: stats?.totalDrivers || 45,
      trend: '+5%',
      isPositive: true,
      sub: '38 on road',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      onClick: () => setActiveView('drivers')
    },
    {
      title: 'DELIVERIES TODAY',
      value: stats?.deliveriesToday || 342,
      trend: '+18%',
      isPositive: true,
      sub: '94% on-time',
      icon: <Package className="w-5 h-5 text-purple-600" />,
      onClick: () => setActiveView('deliveries')
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* 1. Executive Operations Header with whileInView */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.6 }}
        className="bg-neutral-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-neutral-800"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300">
                CENTRAL OPERATIONS DISPATCH
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Good evening, {currentUser?.name.split(' ')[0] || 'Fleet Manager'}
            </h1>
            <p className="text-neutral-400 text-xs md:text-sm mt-1">
              Your fleet is currently operating at <strong className="text-emerald-400">92.4% composite efficiency</strong> across all active routes.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMapProvider('google');
                setActiveView('tracking');
              }}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Live Google Map</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('maintenance')}
              className="px-4 py-2 rounded-full bg-neutral-800 text-neutral-200 text-xs font-semibold tracking-wider hover:bg-neutral-700 transition-colors flex items-center gap-1.5 border border-neutral-700"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Predictions</span>
            </motion.button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* 2. Top 6 KPI Cards with staggered whileInView animations */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={kpi.onClick}
            className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 transition-colors">
                {kpi.icon}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                  kpi.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {kpi.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {kpi.trend}
              </span>
            </div>
            <div className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">
              {kpi.title}
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-neutral-900 font-mono my-0.5">
              {kpi.value}
            </div>
            <div className="text-[10px] text-neutral-400 truncate">{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* 3. Middle Section: Telemetry Area Chart + Live Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Fleet Performance & Telemetry Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-neutral-900">Fleet Telemetry & Efficiency</h3>
              <p className="text-xs text-neutral-500">Live operational utilization throughout today's dispatch cycle</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Active Units
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Efficiency %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="active" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#activeGrad)" name="Active Vehicles" />
                <Area type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#effGrad)" name="Efficiency %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Active Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
                  Active Fleet Alerts
                </h3>
              </div>
              <button
                onClick={() => setActiveView('alerts')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 4).map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="p-3 rounded-2xl bg-[#f8fafc] border border-neutral-100 hover:border-neutral-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        alert.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.severity === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-neutral-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-800 leading-snug line-clamp-2">{alert.message}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('alerts')}
            className="w-full mt-3 py-2 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold transition-colors text-center"
          >
            Open Alert Center
          </button>
        </motion.div>

      </div>

      {/* 4. Bottom Grid: Predictive Maintenance Risk Radar + Quick Vehicle Fleet Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Predictive Maintenance Engine Widget */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Predictive Maintenance Forecast</h3>
                <p className="text-xs text-neutral-500">Heuristic ML rule engine calculating parts failure probability</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('maintenance')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Full Forecast →
            </button>
          </div>

          <div className="space-y-3">
            {predictions.slice(0, 3).map((pred, i) => (
              <motion.div
                key={pred.vehicleId}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-3.5 rounded-2xl bg-[#fafbfc] border border-neutral-200/80 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs font-mono text-neutral-900">{pred.vehicleReg}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        pred.riskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700'
                          : pred.riskLevel === 'HIGH'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {pred.riskLevel} RISK
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">
                    Predicted: <strong className="text-neutral-900">{pred.predictedIssue}</strong>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Est. Service: Within {pred.estimatedServiceDays} days • {pred.mileage.toLocaleString()} km
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-neutral-900 font-mono">
                    {pred.riskScore}%
                  </div>
                  <div className="text-[9px] text-neutral-400 uppercase font-semibold">Risk Index</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Vehicle Fleet Live Telemetry */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Active Fleet Movement</h3>
                <p className="text-xs text-neutral-500">Live GPS tracking status across transit corridors</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('tracking')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Open Live Map →
            </button>
          </div>

          <div className="space-y-2">
            {vehicles.slice(0, 4).map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                whileHover={{ x: 3 }}
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  setActiveView('tracking');
                }}
                className="p-3 rounded-2xl hover:bg-neutral-50 border border-neutral-100 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-700">
                    {vehicle.type === 'Truck' ? '🚛' : vehicle.type === 'Van' ? '🚐' : '🚗'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-neutral-900 font-mono">
                      {vehicle.registrationNumber}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {vehicle.driverName || 'Unassigned'} • {vehicle.destination || 'Depot'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-xs font-bold text-blue-600 font-mono">{vehicle.speed} km/h</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{vehicle.fuelLevel}% Fuel</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
