import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import { Vehicle, VehicleType, VehicleStatus } from '../../types';
import { VehicleDetailModal } from './VehicleDetailModal';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  MapPin,
  Trash2,
  Edit2,
  Gauge,
  Fuel,
  Activity,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';

export const VehiclesView: React.FC = () => {
  const {
    vehicles,
    deleteVehicle,
    setIsAddVehicleOpen,
    setActiveView,
    setSelectedVehicle
  } = useFleet();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [inspectVehicle, setInspectVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    if (typeFilter !== 'all' && v.type !== typeFilter) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        v.registrationNumber.toLowerCase().includes(q) ||
        v.vehicleId.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.driverName && v.driverName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Active</span>;
      case 'in_transit':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">In Transit</span>;
      case 'warning':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Warning</span>;
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">Critical</span>;
      case 'maintenance':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">Maintenance</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">Offline</span>;
    }
  };

  const handleTrackOnMap = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setInspectVehicle(null);
    setActiveView('tracking');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header with Title and Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Fleet Vehicle Management</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor registration, real-time telemetry, vehicle health scores, and service maintenance cycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-black' : 'text-neutral-500'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-neutral-500'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddVehicleOpen(true)}
            className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Vehicle</span>
          </motion.button>
        </div>
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
            placeholder="Search vehicle ID, registration, driver..."
            className="w-full bg-[#f2f4f8] text-xs rounded-xl pl-8 pr-3 py-2 border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#f2f4f8] border border-neutral-200 text-neutral-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Vehicle Types</option>
            <option value="Truck">Trucks</option>
            <option value="Van">Vans</option>
            <option value="Car">Electric Cars</option>
            <option value="Bus">Coaches / Buses</option>
            <option value="Pickup">Pickups</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#f2f4f8] border border-neutral-200 text-neutral-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="in_transit">In Transit</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <span className="text-neutral-400 text-xs whitespace-nowrap pl-2">
            Showing <strong>{filteredVehicles.length}</strong> of {vehicles.length}
          </span>
        </div>
      </motion.div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Vehicle ID & Reg</th>
                  <th className="py-3.5 px-4">Model & Type</th>
                  <th className="py-3.5 px-4">Driver</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Fuel</th>
                  <th className="py-3.5 px-4">Mileage</th>
                  <th className="py-3.5 px-4">Health Score</th>
                  <th className="py-3.5 px-4">Next Service</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredVehicles.map((vehicle, idx) => (
                  <motion.tr
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.4) }}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 font-mono">{vehicle.registrationNumber}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{vehicle.vehicleId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-800">{vehicle.model}</div>
                      <div className="text-[10px] text-neutral-400">{vehicle.type} ({vehicle.year})</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700">
                      {vehicle.driverName || <span className="text-neutral-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(vehicle.status)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="font-mono font-semibold">{vehicle.fuelLevel}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">
                      {vehicle.mileage.toLocaleString()} km
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              vehicle.healthScore > 80 ? 'bg-emerald-500' : vehicle.healthScore > 65 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${vehicle.healthScore}%` }}
                          />
                        </div>
                        <span className="font-bold font-mono text-[11px]">{vehicle.healthScore}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{vehicle.nextServiceDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectVehicle(vehicle)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
                          title="View Telemetry & Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleTrackOnMap(vehicle)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Track on Live Map"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVehicle(vehicle.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                          title="Delete vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View with whileInView */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.5) }}
              whileHover={{ y: -4 }}
              className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">{vehicle.vehicleId}</span>
                    <h3 className="font-extrabold text-base text-neutral-900 font-mono tracking-tight">
                      {vehicle.registrationNumber}
                    </h3>
                  </div>
                  {getStatusBadge(vehicle.status)}
                </div>

                <div className="text-xs text-neutral-600 mb-3">
                  {vehicle.model} • {vehicle.type}
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#f8fafc] p-2.5 rounded-2xl border border-neutral-100 text-center mb-3">
                  <div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">Speed</div>
                    <div className="font-bold text-xs font-mono text-blue-600">{vehicle.speed} km/h</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">Fuel</div>
                    <div className="font-bold text-xs font-mono text-emerald-600">{vehicle.fuelLevel}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">Health</div>
                    <div className="font-bold text-xs font-mono text-neutral-900">{vehicle.healthScore}%</div>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 space-y-1">
                  <div>Driver: <strong className="text-neutral-800">{vehicle.driverName || 'Unassigned'}</strong></div>
                  <div>Mileage: <strong className="text-neutral-800 font-mono">{vehicle.mileage.toLocaleString()} km</strong></div>
                  <div>Service: <strong className="text-neutral-800">{vehicle.nextServiceDate}</strong></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                <button
                  onClick={() => setInspectVehicle(vehicle)}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleTrackOnMap(vehicle)}
                  className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Track</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vehicle Detail Inspect Modal */}
      {inspectVehicle && (
        <VehicleDetailModal
          vehicle={inspectVehicle}
          onClose={() => setInspectVehicle(null)}
          onTrackOnMap={handleTrackOnMap}
        />
      )}
    </div>
  );
};
