import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import { Delivery, DeliveryStatus } from '../../types';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  User
} from 'lucide-react';

export const DeliveriesView: React.FC = () => {
  const { deliveries, updateDeliveryStatus, setIsAddDeliveryOpen } = useFleet();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDeliveries = deliveries.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.deliveryId.toLowerCase().includes(q) ||
        d.customer.toLowerCase().includes(q) ||
        d.pickup.toLowerCase().includes(q) ||
        d.destination.toLowerCase().includes(q) ||
        d.vehicleReg.toLowerCase().includes(q) ||
        d.driverName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Delivered</span>;
      case 'in_transit':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">In Transit</span>;
      case 'assigned':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">Assigned</span>;
      case 'delayed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">Delayed</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Pending</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">Cancelled</span>;
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
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Delivery Consignment Tracking</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor real-time fulfillment timelines, vehicle load weight, and customer ETAs.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddDeliveryOpen(true)}
          className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Delivery</span>
        </motion.button>
      </motion.div>

      {/* Filters and Search */}
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
            placeholder="Search delivery ID, customer, driver..."
            className="w-full bg-[#f2f4f8] text-xs rounded-xl pl-8 pr-3 py-2 border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
          {['all', 'in_transit', 'assigned', 'delivered', 'delayed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
                statusFilter === st ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st === 'in_transit' ? 'In Transit' : st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.map((del, idx) => (
          <motion.div
            key={del.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.4) }}
            whileHover={{ y: -3 }}
            className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            {/* Left Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-neutral-400">{del.deliveryId}</span>
                <h3 className="font-extrabold text-base text-neutral-900 truncate">{del.customer}</h3>
                {getStatusBadge(del.status)}
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600 mb-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{del.pickup}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <strong className="text-neutral-800">{del.destination}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
                <span>Vehicle: <strong className="text-neutral-800">{del.vehicleReg}</strong></span>
                <span>Driver: <strong className="text-neutral-800">{del.driverName}</strong></span>
                <span>Weight: <strong className="text-neutral-800">{del.totalWeightKg.toLocaleString()} kg</strong></span>
              </div>
            </div>

            {/* Delivery Progress Timeline */}
            <div className="lg:w-96 bg-[#f8fafc] p-3.5 rounded-2xl border border-neutral-100 flex-shrink-0">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Fulfillment Timeline
              </div>
              <div className="flex items-center justify-between relative">
                {del.timeline.map((step, sIdx) => (
                  <div key={sIdx} className="flex flex-col items-center relative z-10 flex-1 text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                        step.completed
                          ? 'bg-black text-white ring-2 ring-neutral-200'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {step.completed ? '✓' : sIdx + 1}
                    </div>
                    <span className="text-[9px] font-semibold text-neutral-700 leading-tight">
                      {step.label}
                    </span>
                    <span className="text-[8px] text-neutral-400 mt-0.5">{step.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {del.status !== 'delivered' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateDeliveryStatus(del.id, 'delivered')}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Delivered</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
