import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  User,
  Building,
  X,
  Shield,
  CheckCircle,
  Truck,
  Crown,
  LogIn,
  LogOut,
  Sparkles,
  Database,
  ArrowRight,
  IdCard,
  Phone,
  RefreshCw
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    activeView,
    currentUser,
    loginWithGoogle,
    loginAsOwner,
    loginAsDriver,
    logoutUser,
    isFirebaseLoading,
    vehicles,
    authToast,
    setAuthToast
  } = useFleet();

  const [activeTab, setActiveTab] = useState<'owner' | 'driver'>('owner');
  const [googlePreferredRole, setGooglePreferredRole] = useState<'Owner' | 'Driver'>('Owner');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [company, setCompany] = useState('Singhania Heavy Logistics Corp');
  const [phone, setPhone] = useState('+91 98401 22891');
  const [licenseNumber, setLicenseNumber] = useState('TN-01-2018-0091823');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'veh-1');

  if (!isAuthModalOpen) return null;

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginAsOwner({
      name: name || 'Rajesh Singhania',
      email: email || 'owner@fleetx.io',
      company: company || 'Singhania Heavy Logistics Corp'
    }, activeView !== 'login' ? activeView : 'reference');
    setIsAuthModalOpen(false);
  };

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginAsDriver({
      name: name || 'Arun Kumar',
      email: email || 'arun.k@fleetx.io',
      vehicleId: selectedVehicleId,
      licenseNumber: licenseNumber || 'TN-01-2018-0091823'
    }, activeView === 'reference' ? 'reference' : 'driver-portal');
    setIsAuthModalOpen(false);
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle(
      googlePreferredRole,
      googlePreferredRole === 'Driver' && activeView !== 'reference' ? 'driver-portal' : (activeView !== 'login' ? activeView : 'reference')
    );
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-black text-white p-6 relative flex-shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              FLEETX IDENTITY & ACCESS GATEWAY
            </span>
          </div>
          
          <h2 className="text-xl font-black tracking-tight text-white">
            Individual Role Sign In
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access dedicated portals for Fleet Owners and Commercial Drivers with persistent Cloud Firestore database sync.
          </p>

          {/* Database Connection Indicator */}
          <div className="mt-3 flex items-center justify-between text-[11px] bg-neutral-800/80 rounded-xl px-3 py-1.5 border border-neutral-700/80">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Database: <strong className="text-white">Firestore users collection</strong></span>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected
            </span>
          </div>
        </div>

        {/* Current User Session Bar if logged in */}
        {currentUser && (
          <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200/80 flex items-center justify-between gap-3 text-xs flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-neutral-300 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-neutral-900 truncate">
                  Logged in as: {currentUser.name}
                </div>
                <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                  <span className={`px-1.5 py-0.2 rounded font-semibold text-[9px] ${
                    currentUser.role === 'Owner'
                      ? 'bg-amber-100 text-amber-800'
                      : currentUser.role === 'Driver'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {currentUser.role}
                  </span>
                  {currentUser.isGoogleLinked && <span>• Google Connected</span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => logoutUser()}
              className="text-neutral-500 hover:text-rose-600 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. Google Single Sign-On (Auto-connects previous login!) */}
          <div className="bg-gradient-to-br from-neutral-50 to-blue-50/30 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Google Single Sign-On
              </span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-full">
                Auto-Restores Previous Session
              </span>
            </div>
            
            <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
              Sign in with your Google account. If previously registered, you will be <strong>automatically connected</strong> with your saved Owner or Driver profile from Firestore.
            </p>

            {/* Role Preference for first-time Google logins */}
            <div className="mb-3">
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                If new user, create account as:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGooglePreferredRole('Owner')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    googlePreferredRole === 'Owner'
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  Fleet Owner
                </button>
                <button
                  type="button"
                  onClick={() => setGooglePreferredRole('Driver')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    googlePreferredRole === 'Driver'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Fleet Driver
                </button>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isFirebaseLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs border border-neutral-300 shadow-sm flex items-center justify-center gap-3 transition-all hover:shadow-md disabled:opacity-50"
            >
              {isFirebaseLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-neutral-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isFirebaseLoading ? 'Connecting to Google & Database...' : 'Continue with Google Account'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 absolute">
              OR LOGIN BY ROLE
            </span>
          </div>

          {/* 2. Individual Role Tab Switcher: Owner vs Driver */}
          <div className="flex bg-neutral-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('owner')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'owner'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              Fleet Owner Portal
            </button>
            <button
              onClick={() => setActiveTab('driver')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'driver'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-600 hover:text-blue-600'
              }`}
            >
              <Truck className="w-4 h-4" />
              Driver Portal
            </button>
          </div>

          {/* Tab Form: Fleet Owner */}
          {activeTab === 'owner' && (
            <form onSubmit={handleOwnerSubmit} className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <Crown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Owner Authority:</strong>
                  Full fleet management, telematics control, vehicle dispatch, predictive maintenance, and enterprise P&L analytics.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Owner / Executive Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rajesh Singhania"
                    className="w-full bg-[#f8fafc] text-xs rounded-xl pl-9 pr-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Company / Fleet Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Singhania Heavy Logistics Corp"
                    className="w-full bg-[#f8fafc] text-xs rounded-xl pl-9 pr-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Owner Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@fleetx.io"
                    className="w-full bg-[#f8fafc] text-xs rounded-xl pl-9 pr-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f8fafc] text-xs rounded-xl pl-9 pr-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Enter Fleet Owner Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Tab Form: Fleet Driver */}
          {activeTab === 'driver' && (
            <form onSubmit={handleDriverSubmit} className="space-y-4">
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Driver Cockpit Access:</strong>
                  Real-time assigned vehicle telemetry, Hours of Service (HOS) tracker, turn-by-turn dispatch stops, and emergency alerts.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Driver Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arun Kumar"
                    className="w-full bg-[#f8fafc] text-xs rounded-xl pl-9 pr-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Commercial Driver License (CDL)</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="TN-01-2018-0091823"
                    className="w-full bg-[#f8fafc] text-xs rounded-xl pl-9 pr-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Assigned Fleet Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-[#f8fafc] text-xs rounded-xl px-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400 font-medium"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} • {v.model} ({v.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Driver Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arun.k@fleetx.io"
                    className="w-full bg-[#f8fafc] text-xs rounded-xl pl-9 pr-3 py-2.5 border border-neutral-200 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Launch Driver Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Account Shortcuts */}
          <div className="pt-2 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Instant 1-Click Role Switch:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsOwner();
                  setIsAuthModalOpen(false);
                }}
                className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left text-xs transition-colors group"
              >
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 group-hover:text-amber-700">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  Rajesh (Owner)
                </div>
                <div className="text-[10px] text-neutral-500">Full Fleet Executive</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDriver();
                  setIsAuthModalOpen(false);
                }}
                className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left text-xs transition-colors group"
              >
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 group-hover:text-blue-700">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  Arun (Driver)
                </div>
                <div className="text-[10px] text-neutral-500">Assigned: TN 01 AB 1234</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
