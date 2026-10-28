import React from 'react';
import { useFleet, ActiveView } from '../../context/FleetContext';
import {
  LayoutDashboard,
  MapPin,
  Truck,
  Users,
  Route as RouteIcon,
  PackageCheck,
  Wrench,
  Fuel,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Radio,
  Globe2,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    unreadAlertsCount,
    currentUser,
    logoutUser,
    setIsAuthModalOpen,
    setMapProvider
  } = useFleet();

  const navItems: { view: ActiveView; label: string; icon: React.ReactNode; badge?: number; action?: () => void }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      view: 'driver-portal',
      label: currentUser?.role === 'Driver' ? 'My Driver Cockpit' : 'Driver Portal',
      icon: <Radio className={`w-5 h-5 ${currentUser?.role === 'Driver' ? 'text-cyan-400 animate-pulse' : 'text-neutral-400'}`} />
    },
    {
      view: 'tracking',
      label: 'Google Maps Live',
      icon: <Globe2 className="w-5 h-5 text-blue-400" />,
      action: () => {
        setMapProvider('google');
        setActiveView('tracking');
      }
    },
    { view: 'vehicles', label: 'Trucks & Fleet', icon: <Truck className="w-5 h-5" /> },
    { view: 'drivers', label: 'Drivers & HOS', icon: <Users className="w-5 h-5" /> },
    { view: 'routes', label: 'Route Optimizer', icon: <RouteIcon className="w-5 h-5" /> },
    { view: 'deliveries', label: 'Deliveries', icon: <PackageCheck className="w-5 h-5" /> },
    { view: 'maintenance', label: 'Predictive AI', icon: <Wrench className="w-5 h-5 text-amber-400" /> },
    { view: 'fuel', label: 'Fuel & ESG Carbon', icon: <Fuel className="w-5 h-5 text-emerald-400" /> },
    { view: 'alerts', label: 'Alerts', icon: <Bell className="w-5 h-5 text-rose-400" />, badge: unreadAlertsCount },
    { view: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { view: 'reference', label: 'Design Showcase', icon: <Sparkles className="w-5 h-5 text-yellow-300" /> }
  ];

  return (
    <aside
      className={`bg-black text-white h-screen flex flex-col justify-between transition-all duration-300 z-30 select-none shadow-2xl border-r border-neutral-800 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Logo */}
      <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
        <div
          onClick={() => setActiveView('reference')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          {/* Logo Icon matching reference design */}
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-0 left-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-0 right-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-0 left-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-0 right-0" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-widest text-white font-mono">
                FLEETX
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400">
                MOVE SMART. OPERATE BETTER.
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors hidden lg:block"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveView(item.view);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-medium text-xs tracking-wide transition-all ${
                isActive
                  ? 'bg-neutral-800 text-white shadow-md border border-neutral-700/80 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!sidebarCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
              {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
              {sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section (Profile & Role) */}
      <div className="p-3 border-t border-neutral-900 space-y-2">
        <div
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-900 cursor-pointer transition-colors ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          title="Switch User Role / Profile"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 flex-shrink-0 relative">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                <span>{currentUser?.name || 'Sign In / Register'}</span>
                {currentUser?.isGoogleLinked && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Google Connected" />
                )}
              </div>
              <div className="text-[10px] text-cyan-400 truncate flex items-center gap-1 font-medium">
                <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                  currentUser?.role === 'Owner'
                    ? 'bg-amber-500/20 text-amber-300'
                    : currentUser?.role === 'Driver'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {currentUser?.role || 'Guest'}
                </span>
                {currentUser?.role === 'Driver' && currentUser.assignedVehicleReg && (
                  <span className="text-neutral-400 truncate">({currentUser.assignedVehicleReg})</span>
                )}
              </div>
            </div>
          )}
        </div>

        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-neutral-500">
            <span>FLEETX v2.4</span>
            <button
              onClick={() => {
                logoutUser();
                setActiveView('login');
              }}
              className="text-neutral-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Return to Individual Login"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center pt-1">
            <button
              onClick={() => {
                logoutUser();
                setActiveView('login');
              }}
              className="p-1 text-neutral-400 hover:text-rose-400 cursor-pointer transition-colors"
              title="Sign Out to Login Gate"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
