import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import { AlertSeverity } from '../../types';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Check,
  Search,
  Truck,
  Filter
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { alerts, markAlertRead, setActiveView, setSelectedVehicle, vehicles } = useFleet();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterRead === 'unread' && a.isRead) return false;
    if (filterRead === 'read' && !a.isRead) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.message.toLowerCase().includes(q) ||
        (a.vehicleReg && a.vehicleReg.toLowerCase().includes(q)) ||
        (a.driverName && a.driverName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleJumpToVehicle = (vehicleReg?: string) => {
    if (!vehicleReg) return;
    const v = vehicles.find((veh) => veh.registrationNumber === vehicleReg);
    if (v) {
      setSelectedVehicle(v);
      setActiveView('tracking');
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
      >
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Fleet Alert Center</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Real-time sensor alarms, driver speed warnings, diagnostic exceptions, and dispatch notifications.
        </p>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between"
      >
        <div className="w-full md:w-80 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts by message, vehicle..."
            className="w-full bg-[#f2f4f8] text-xs rounded-xl pl-8 pr-3 py-2 border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
            {['all', 'critical', 'warning', 'info'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterSeverity === sev ? 'bg-white shadow-xs text-black font-semibold' : 'text-neutral-500'
                }`}
              >
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
            {['all', 'unread', 'read'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRead(r)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterRead === r ? 'bg-white shadow-xs text-black font-semibold' : 'text-neutral-500'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Alert List with whileInView */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-neutral-200 text-neutral-400">
            No alerts found matching current filters.
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-3xl border bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !alert.isRead ? 'border-neutral-300 ring-1 ring-neutral-200/80 bg-[#fafbfc]' : 'border-neutral-200 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-0.5">
                  {alert.severity === 'critical' && (
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {alert.severity === 'warning' && (
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {alert.severity === 'info' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
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
                    <span className="text-[10px] text-neutral-400 font-mono">{alert.timestamp}</span>
                    {alert.vehicleReg && (
                      <span className="text-[10px] font-mono font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        {alert.vehicleReg}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-800 leading-relaxed font-medium">{alert.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {alert.vehicleReg && (
                  <button
                    onClick={() => handleJumpToVehicle(alert.vehicleReg)}
                    className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Vehicle</span>
                  </button>
                )}
                {!alert.isRead && (
                  <button
                    onClick={() => markAlertRead(alert.id)}
                    className="px-3 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Read</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
