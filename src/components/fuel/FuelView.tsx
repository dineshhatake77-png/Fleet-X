import React from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import {
  Fuel,
  TrendingDown,
  AlertTriangle,
  Zap,
  DollarSign,
  Gauge,
  BarChart2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const FuelView: React.FC = () => {
  const { fuelRecords, fuelAnalytics, stats } = useFleet();

  const dailyFuelTrend = [
    { day: 'Mon', liters: 740, cost: 71780, baseline: 710 },
    { day: 'Tue', liters: 810, cost: 78570, baseline: 710 },
    { day: 'Wed', liters: 790, cost: 76630, baseline: 710 },
    { day: 'Thu', liters: 860, cost: 83420, baseline: 710 },
    { day: 'Fri', liters: 920, cost: 89240, baseline: 710 },
    { day: 'Sat', liters: 520, cost: 50440, baseline: 710 },
    { day: 'Sun', liters: 180, cost: 17460, baseline: 710 },
  ];

  const vehicleEfficiencyComparison = [
    { reg: 'TN 01 AB 1234', rate: 28.2, benchmark: 28.0, name: 'Tata Prima' },
    { reg: 'TN 02 CD 4567', rate: 11.4, benchmark: 11.0, name: 'Traveller' },
    { reg: 'TN 10 EF 7821', rate: 34.2, benchmark: 30.0, name: 'BharatBenz' },
    { reg: 'TN 04 GH 9901', rate: 8.9, benchmark: 9.0, name: 'Bolero' },
    { reg: 'TN 04 XZ 2211', rate: 35.8, benchmark: 29.0, name: 'Ashok Leyland' },
    { reg: 'TN 12 ST 2233', rate: 29.5, benchmark: 28.5, name: 'Eicher Tipper' },
    { reg: 'TN 18 WX 6677', rate: 30.8, benchmark: 30.0, name: 'Signa Heavy' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Fuel & Telematics Analytics</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Real-time diesel & EV battery consumption rates, per-kilometer expenditure, and consumption anomaly detection.
        </p>
      </motion.div>

      {/* 1. Fuel KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: 'Total Fuel Used', value: '4,820 L', sub: "This week's consumption" },
          { title: 'Avg Consumption', value: '14.2 L', sub: 'Per 100 kilometers', color: 'text-blue-600' },
          { title: 'Total Fuel Cost', value: '₹4,72,360', sub: 'Average ₹97.2 / Liter' },
          { title: 'Cost Per KM', value: '₹8.42', sub: '-3.2% vs last month', subColor: 'text-emerald-600 font-semibold' },
          { title: 'Fuel Efficiency', value: '91%', sub: 'OPTIMAL FLEET RANGE', color: 'text-emerald-600', subColor: 'text-emerald-600 font-semibold' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.07 }}
            className={`bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm ${idx === 4 ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{kpi.title}</div>
            <div className={`text-xl md:text-2xl font-extrabold font-mono my-1 ${kpi.color || 'text-neutral-900'}`}>{kpi.value}</div>
            <div className={`text-[10px] ${kpi.subColor || 'text-neutral-500'}`}>{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* 2. Fuel Efficiency Anomaly Alert Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex items-start gap-4 shadow-sm"
      >
        <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-amber-950 uppercase tracking-wide">
              High Consumption Anomaly Detected
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              ALERT
            </span>
          </div>
          <p className="text-xs text-amber-900 mt-1 leading-relaxed">
            Vehicle <strong className="font-mono text-neutral-950">TN 04 XZ 2211</strong> (Ashok Leyland 2820 Cargo) is consuming <strong className="text-rose-700">18% more fuel</strong> (35.8 L/100km) than its fleet category average (29.1 L/100km). Recommended action: Run fuel injector cleaning and verify air intake filter.
          </p>
        </div>
      </motion.div>

      {/* 3. Charts: Daily Consumption & Vehicle Comparison with whileInView */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily Fuel Consumption Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45 }}
          className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Weekly Fuel Consumption Trend</h3>
              <p className="text-xs text-neutral-500">Liters consumed per day vs baseline target</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">This Week</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyFuelTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend />
                <Bar dataKey="liters" fill="#3b82f6" name="Fuel Used (L)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" fill="#cbd5e1" name="Baseline (L)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vehicle Efficiency Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Vehicle Consumption Comparison (L/100km)</h3>
              <p className="text-xs text-neutral-500">Actual telemetry rate vs OEM benchmark</p>
            </div>
            <span className="text-xs text-neutral-400">Lower is better</span>
          </div>

          <div className="space-y-3">
            {vehicleEfficiencyComparison.map((veh, i) => {
              const isExcessive = veh.rate > veh.benchmark * 1.1;

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-neutral-900">{veh.reg} ({veh.name})</span>
                    <span className={`font-mono font-bold ${isExcessive ? 'text-rose-600' : 'text-neutral-700'}`}>
                      {veh.rate} L/100km (OEM: {veh.benchmark})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, (veh.rate / 40) * 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className={`h-full rounded-full ${isExcessive ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
