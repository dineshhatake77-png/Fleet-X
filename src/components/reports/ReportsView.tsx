import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Truck,
  Users,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const ReportsView: React.FC = () => {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '3m'>('7d');

  const fleetUtilizationData = [
    { day: 'Day 1', utilization: 86, distance: 4120 },
    { day: 'Day 2', utilization: 91, distance: 4890 },
    { day: 'Day 3', utilization: 89, distance: 4720 },
    { day: 'Day 4', utilization: 94, distance: 5120 },
    { day: 'Day 5', utilization: 92, distance: 4950 },
    { day: 'Day 6', utilization: 78, distance: 3200 },
    { day: 'Day 7', utilization: 65, distance: 2100 },
  ];

  const deliverySuccessData = [
    { name: 'On-Time Delivered', value: 315, color: '#10b981' },
    { name: 'Traffic Delayed', value: 21, color: '#f59e0b' },
    { name: 'Re-routed', value: 6, color: '#3b82f6' },
  ];

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
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Executive Operational Reports</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Fleet utilization metrics, driver safety index, deadhead mileage reductions, and on-time fulfillment rates.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-2xl border border-neutral-200 self-start sm:self-auto text-xs font-semibold">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '3m', label: '3 Months' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateRange(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                dateRange === tab.id ? 'bg-white shadow-xs text-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Top Aggregate Summary with whileInView */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Fleet Utilization', value: '91.8%', sub: '+3.4% vs benchmark', subColor: 'text-emerald-600 font-semibold' },
          { title: 'Total Distance', value: '29,100 km', sub: 'Recorded across 20 active units', color: 'text-blue-600' },
          { title: 'On-Time Delivery', value: '94.2%', sub: '315 out of 342 consignments', color: 'text-emerald-600' },
          { title: 'Downtime Hours', value: '14.5 hrs', sub: 'Reduced by 28% via AI', subColor: 'text-emerald-600 font-semibold' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm"
          >
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{item.title}</div>
            <div className={`text-2xl font-extrabold font-mono my-1 ${item.color || 'text-neutral-900'}`}>{item.value}</div>
            <div className={`text-[10px] ${item.subColor || 'text-neutral-500'}`}>{item.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid with whileInView */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Utilization Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-2 bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Fleet Utilization % & Distance Covered</h3>
              <p className="text-xs text-neutral-500">Daily telemetry log for selected reporting window</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">Avg 91.8%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fleetUtilizationData}>
                <defs>
                  <linearGradient id="utGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#utGrad)" name="Utilization %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Delivery On-Time Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
              Fulfillment Performance
            </div>
            <p className="text-xs text-neutral-500 mb-4">On-time SLA adherence across regional hubs</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliverySuccessData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deliverySuccessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {deliverySuccessData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-700">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-900">{item.value} ({Math.round((item.value / 342) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Certified SLA</span>
            <span className="font-bold text-emerald-600">94.2% EXCELLENCE</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
