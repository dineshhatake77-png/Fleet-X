import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  Search,
  Bell,
  Plus,
  Play,
  Pause,
  Sparkles,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Package,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    globalSearch,
    setGlobalSearch,
    stats,
    vehicles,
    unreadAlertsCount,
    alerts,
    markAlertRead,
    isDemoMode,
    setIsDemoMode,
    currentUser,
    setIsAddVehicleOpen,
    setIsAddDriverOpen,
    setIsAddDeliveryOpen,
    setIsScheduleMaintenanceOpen,
    setIsAuthModalOpen,
    setActiveView
  } = useFleet();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = vehicles.filter(v => v.status === 'active' || v.status === 'in_transit').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'maintenance').length;
  const warningCount = vehicles.filter(v => v.status === 'warning' || v.status === 'critical').length;

  return (
    <header className="h-16 bg-white border-b border-neutral-200/80 px-4 md:px-6 flex items-center justify-between gap-4 z-20 shadow-xs">
      {/* 1. Global Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search vehicles (e.g. TN 01 AB 1234), drivers, deliveries..."
          className="w-full bg-[#f2f4f8] text-neutral-800 placeholder-neutral-400 text-xs rounded-full pl-9 pr-4 py-2 border border-transparent focus:border-neutral-400 focus:bg-white focus:outline-none transition-all"
        />
        {globalSearch && (
          <button
            onClick={() => setGlobalSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Middle Live Fleet Status Pill */}
      <div className="hidden xl:flex items-center gap-2 bg-[#f4f6fa] px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-neutral-800">
          {activeCount} Active
        </span>
        <span className="text-neutral-300">•</span>
        <span className="text-amber-600 font-medium">
          {warningCount} Warnings
        </span>
        <span className="text-neutral-300">•</span>
        <span className="text-neutral-500">
          {maintenanceCount} In Bay
        </span>
      </div>

      {/* 3. Right Actions & Status */}
      <div className="flex items-center gap-3">

        {/* Demo Mode Toggle */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            isDemoMode
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
              : 'bg-neutral-100 text-neutral-600 border-neutral-300'
          }`}
          title="Toggle Real-Time Telemetry Simulation"
        >
          {isDemoMode ? <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" /> : <Pause className="w-3 h-3" />}
          <span className="hidden sm:inline">DEMO SIMULATION:</span>
          <span>{isDemoMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-600 font-mono bg-neutral-100 px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5 text-neutral-500" />
          <span>{currentTime}</span>
        </div>

        {/* Reference Image View Toggle */}
        <button
          onClick={() => setActiveView('reference')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black text-white hover:bg-neutral-800 transition-colors shadow-xs"
          title="View Original Reference Layout"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>REFERENCE DESIGN</span>
        </button>

        {/* Quick Action Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Action</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isQuickActionOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => { setIsAddVehicleOpen(true); setIsQuickActionOpen(false); }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-2.5"
              >
                <Truck className="w-4 h-4 text-blue-600" />
                <span>+ Add Vehicle</span>
              </button>
              <button
                onClick={() => { setIsAddDriverOpen(true); setIsQuickActionOpen(false); }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-2.5"
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span>+ Add Driver</span>
              </button>
              <button
                onClick={() => { setIsAddDeliveryOpen(true); setIsQuickActionOpen(false); }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-2.5"
              >
                <Package className="w-4 h-4 text-purple-600" />
                <span>+ Create Delivery</span>
              </button>
              <button
                onClick={() => { setIsScheduleMaintenanceOpen(true); setIsQuickActionOpen(false); }}
                className="w-full px-4 py-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 flex items-center gap-2.5"
              >
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>+ Schedule Maintenance</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors relative"
            title="Alerts Center"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  Fleet Alerts ({unreadAlertsCount} Unread)
                </span>
                <button
                  onClick={() => { setActiveView('alerts'); setIsAlertsOpen(false); }}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 my-2">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => { markAlertRead(alert.id); }}
                    className={`py-2.5 px-2 hover:bg-neutral-50 rounded-xl cursor-pointer transition-colors ${
                      !alert.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {alert.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />}
                      {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                      {alert.severity === 'info' && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-800 leading-snug line-clamp-2">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                          <span>{alert.timestamp}</span>
                          {alert.vehicleReg && <span>• {alert.vehicleReg}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Pill */}
        <div
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 pl-3 border-l border-neutral-200 cursor-pointer hover:opacity-85 transition-opacity"
          title="Switch Portal: Fleet Owner vs Driver or Connect Google"
        >
          <div className="relative">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover border border-neutral-300"
            />
            {currentUser?.isGoogleLinked && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Connected with Google" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-neutral-900 leading-none flex items-center gap-1">
              <span>{currentUser?.name.split(' ')[0] || 'Sign In'}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                currentUser?.role === 'Owner'
                  ? 'bg-amber-100 text-amber-800'
                  : currentUser?.role === 'Driver'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-neutral-100 text-neutral-600'
              }`}>
                {currentUser?.role || 'Guest'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
