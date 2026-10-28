import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { VehicleType } from '../../types';
import { Truck, Users, Package, Wrench, X } from 'lucide-react';

export const QuickActionModals: React.FC = () => {
  const {
    isAddVehicleOpen,
    setIsAddVehicleOpen,
    isAddDriverOpen,
    setIsAddDriverOpen,
    isAddDeliveryOpen,
    setIsAddDeliveryOpen,
    isScheduleMaintenanceOpen,
    setIsScheduleMaintenanceOpen,
    addVehicle,
    addDriver,
    addDelivery,
    addMaintenance,
    vehicles,
    drivers
  } = useFleet();

  // Add Vehicle State
  const [vehicleReg, setVehicleReg] = useState('TN 09 KL 7711');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Truck');
  const [vehicleModel, setVehicleModel] = useState('Tata Signa 4825.TK Heavy');

  // Add Driver State
  const [driverName, setDriverName] = useState('Vignesh Subramanian');
  const [driverLicense, setDriverLicense] = useState('TN-02-2022-0089123');
  const [driverPhone, setDriverPhone] = useState('+91 94440 88219');

  // Add Delivery State
  const [delCustomer, setDelCustomer] = useState('Foxconn Industrial SEZ');
  const [delPickup, setDelPickup] = useState('Chennai Port Terminal');
  const [delDest, setDelDest] = useState('Sriperumbudur Factory');
  const [delVehicle, setDelVehicle] = useState(vehicles[0]?.id || 'veh-1');

  // Schedule Maintenance State
  const [maintVehicle, setMaintVehicle] = useState(vehicles[0]?.id || 'veh-1');
  const [maintType, setMaintType] = useState('Brake Pad & Rotor Inspection');
  const [maintTech, setMaintTech] = useState('K. Selvaraj (Master Tech)');
  const [maintCost, setMaintCost] = useState('18500');

  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVehicle({
      registrationNumber: vehicleReg,
      type: vehicleType,
      model: vehicleModel,
      mileage: 24000,
      fuelLevel: 100,
      healthScore: 98,
      status: 'active'
    });
    setIsAddVehicleOpen(false);
  };

  const handleAddDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDriver({
      name: driverName,
      licenseNumber: driverLicense,
      phone: driverPhone,
      status: 'available',
      safetyScore: 95
    });
    setIsAddDriverOpen(false);
  };

  const handleAddDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find(veh => veh.id === delVehicle) || vehicles[0];
    await addDelivery({
      customer: delCustomer,
      pickup: delPickup,
      destination: delDest,
      assignedVehicleId: v.id,
      vehicleReg: v.registrationNumber,
      driverName: v.driverName || 'Chief Dispatch Pilot'
    });
    setIsAddDeliveryOpen(false);
  };

  const handleScheduleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find(veh => veh.id === maintVehicle) || vehicles[0];
    await addMaintenance({
      vehicleId: v.id,
      vehicleReg: v.registrationNumber,
      serviceType: maintType,
      technician: maintTech,
      cost: Number(maintCost),
      mileage: v.mileage,
      status: 'Scheduled'
    });
    setIsScheduleMaintenanceOpen(false);
  };

  return (
    <>
      {/* 1. Add Vehicle Modal */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm tracking-wide">Register New Fleet Unit</h3>
              </div>
              <button onClick={() => setIsAddVehicleOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddVehicleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                >
                  <option value="Truck">Heavy Commercial Truck</option>
                  <option value="Van">Cargo Van</option>
                  <option value="Car">Electric Vehicle</option>
                  <option value="Bus">Passenger Coach</option>
                  <option value="Pickup">Pickup Utility</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Manufacturer & Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold tracking-wider uppercase transition-colors"
              >
                Save & Initialize Telemetry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Driver Modal */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wide">Enroll Professional Driver</h3>
              </div>
              <button onClick={() => setIsAddDriverOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddDriverSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Commercial Driving License</label>
                <input
                  type="text"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none font-mono"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold tracking-wider uppercase transition-colors"
              >
                Enroll Driver
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Create Delivery Modal */}
      {isAddDeliveryOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm tracking-wide">Dispatch New Consignment</h3>
              </div>
              <button onClick={() => setIsAddDeliveryOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddDeliverySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Customer / Client</label>
                <input
                  type="text"
                  value={delCustomer}
                  onChange={(e) => setDelCustomer(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={delPickup}
                  onChange={(e) => setDelPickup(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Destination Facility</label>
                <input
                  type="text"
                  value={delDest}
                  onChange={(e) => setDelDest(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Assign Active Vehicle</label>
                <select
                  value={delVehicle}
                  onChange={(e) => setDelVehicle(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none font-mono"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} ({v.model})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold tracking-wider uppercase transition-colors"
              >
                Dispatch Consignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Schedule Maintenance Modal */}
      {isScheduleMaintenanceOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm tracking-wide">Schedule Depot Service Order</h3>
              </div>
              <button onClick={() => setIsScheduleMaintenanceOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleScheduleMaintenanceSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Vehicle</label>
                <select
                  value={maintVehicle}
                  onChange={(e) => setMaintVehicle(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none font-mono"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} - Risk {v.maintenanceRisk}%
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Service Type & Diagnostics</label>
                <input
                  type="text"
                  value={maintType}
                  onChange={(e) => setMaintType(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Assigned Lead Technician</label>
                <input
                  type="text"
                  value={maintTech}
                  onChange={(e) => setMaintTech(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  value={maintCost}
                  onChange={(e) => setMaintCost(e.target.value)}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2 border border-neutral-200 focus:outline-none font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold tracking-wider uppercase transition-colors"
              >
                Schedule Work Order
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
