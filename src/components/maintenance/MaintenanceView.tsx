import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import { PredictiveFailureTimeline } from './PredictiveFailureTimeline';
import {
  Wrench,
  AlertTriangle,
  Cpu,
  ShieldCheck,
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  User,
  Sparkles,
  Layers
} from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const { predictions, maintenance, setIsScheduleMaintenanceOpen } = useFleet();
  const [activeTab, setActiveTab] = useState<'timeline' | 'predictions' | 'history'>('timeline');

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
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-700 font-bold">
              HEURISTIC PREDICTIVE DIAGNOSTIC ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Predictive Fleet Maintenance</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Analyzes IoT telematics (thermal spikes, duty cycles, hard braking decelerations) to forecast mechanical failures before they happen.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsScheduleMaintenanceOpen(true)}
          className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Maintenance</span>
        </motion.button>
      </motion.div>

      {/* 1. Maintenance KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Vehicles Due Soon', value: '12', sub: 'Service required < 14 days', color: 'text-neutral-900', subColor: 'text-amber-600 font-semibold' },
          { title: 'Critical Issues', value: '4', sub: 'Immediate safety inspection', color: 'text-rose-600', subColor: 'text-rose-600 font-semibold' },
          { title: 'Scheduled Work Orders', value: '18', sub: 'In queue at central depots', color: 'text-neutral-900', subColor: 'text-blue-600 font-semibold' },
          { title: 'Completed This Month', value: '42', sub: 'Certified OEM overhauls', color: 'text-emerald-600', subColor: 'text-emerald-600 font-semibold' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm"
          >
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{kpi.title}</div>
            <div className={`text-2xl font-extrabold font-mono my-1 ${kpi.color}`}>{kpi.value}</div>
            <div className={`text-[10px] ${kpi.subColor}`}>{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-black text-white shadow-sm'
              : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Visual Failure Timeline</span>
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'predictions'
              ? 'bg-black text-white shadow-sm'
              : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-amber-500" />
          <span>Vehicle Risk Forecast ({predictions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-black text-white shadow-sm'
              : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-neutral-400" />
          <span>Maintenance Log ({maintenance.length})</span>
        </button>
      </div>

      {/* 2. Visual Component Failure Timeline Dashboard View */}
      {activeTab === 'timeline' && <PredictiveFailureTimeline />}

      {/* 3. Predictive Risk Engine Cards with whileInView */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          {predictions.map((pred, idx) => (
            <motion.div
              key={pred.vehicleId}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.4) }}
              whileHover={{ y: -3 }}
              className={`p-5 rounded-3xl border bg-white shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                pred.riskLevel === 'CRITICAL' ? 'border-rose-300 ring-1 ring-rose-200' : 'border-neutral-200'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-extrabold text-base font-mono text-neutral-900">{pred.vehicleReg}</span>
                  <span className="text-xs text-neutral-400 font-medium">{pred.model}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      pred.riskLevel === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : pred.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-700'
                        : pred.riskLevel === 'MEDIUM'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {pred.riskLevel} RISK
                  </span>
                </div>

                <div className="text-sm font-bold text-neutral-900 mb-2">
                  Predicted Issue: <span className="text-rose-600">{pred.predictedIssue}</span>
                </div>

                <div className="space-y-1 mb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Contributing Heuristics:</div>
                  <ul className="list-disc list-inside text-xs text-neutral-600 space-y-0.5">
                    {pred.contributingFactors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-neutral-500 font-mono">
                  Odometer: <strong>{pred.mileage.toLocaleString()} km</strong> • Est. Service Window: Within <strong className="text-neutral-900">{pred.estimatedServiceDays} days</strong>
                </div>
              </div>

              {/* Risk Gauge Metric */}
              <div className="flex items-center gap-6 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-100 pt-4 lg:pt-0 lg:pl-6 justify-between lg:justify-start">
                <div className="text-center">
                  <div
                    className={`text-3xl font-black font-mono ${
                      pred.riskScore >= 80 ? 'text-rose-600' : pred.riskScore >= 60 ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  >
                    {pred.riskScore}%
                  </div>
                  <div className="text-[10px] font-bold uppercase text-neutral-400">Risk Probability</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsScheduleMaintenanceOpen(true)}
                  className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider transition-colors shadow-sm"
                >
                  Schedule Work Order
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 4. Maintenance History Log */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Mileage</th>
                  <th className="py-3.5 px-4">Cost (₹)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Next Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {maintenance.map((m, idx) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">{m.vehicleReg}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-800">{m.serviceType}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">{m.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700">{m.technician}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">{m.date}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">{m.mileage.toLocaleString()} km</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">₹{m.cost.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{m.nextServiceDate}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
