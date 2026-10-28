import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import {
  Truck,
  Crown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  IdCard,
  Phone,
  CheckCircle2,
  Radio,
  Gauge,
  Compass,
  Zap,
  Globe2
} from 'lucide-react';

export const IndividualLoginGate: React.FC = () => {
  const {
    loginAsOwner,
    loginAsDriver,
    loginWithGoogle,
    isFirebaseLoading,
    vehicles,
    setActiveView
  } = useFleet();

  const [selectedRole, setSelectedRole] = useState<'Owner' | 'Driver'>('Owner');
  
  // Form states
  const [name, setName] = useState('Rajesh Singhania');
  const [email, setEmail] = useState('owner@fleetx.io');
  const [password, setPassword] = useState('••••••••••••');
  const [company, setCompany] = useState('Singhania Heavy Logistics Corp');
  const [licenseNumber, setLicenseNumber] = useState('TN-01-2018-0091823');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'veh-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When switching role, adjust default demo fields nicely
  const handleRoleSelect = (role: 'Owner' | 'Driver') => {
    setSelectedRole(role);
    if (role === 'Owner') {
      setName('Rajesh Singhania');
      setEmail('owner@fleetx.io');
    } else {
      setName('Arun Kumar');
      setEmail('arun.k@fleetx.io');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedRole === 'Owner') {
        await loginAsOwner({
          name: name || 'Rajesh Singhania',
          email: email || 'owner@fleetx.io',
          company: company || 'Singhania Heavy Logistics Corp'
        });
      } else {
        await loginAsDriver({
          name: name || 'Arun Kumar',
          email: email || 'arun.k@fleetx.io',
          vehicleId: selectedVehicleId,
          licenseNumber: licenseNumber || 'TN-01-2018-0091823'
        });
      }
      // Move directly to the landing page as requested
      setActiveView('reference');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle(selectedRole);
      // Move to landing page
      setActiveView('reference');
    } catch (err) {
      console.error('Google Sign In error:', err);
    }
  };

  const handleQuickLogin = async (role: 'Owner' | 'Driver') => {
    setIsSubmitting(true);
    try {
      if (role === 'Owner') {
        await loginAsOwner({
          name: 'Rajesh Singhania',
          email: 'owner@fleetx.io',
          company: 'Singhania Heavy Logistics Corp'
        });
      } else {
        await loginAsDriver({
          name: 'Arun Kumar',
          email: 'arun.k@fleetx.io',
          vehicleId: 'veh-1',
          licenseNumber: 'TN-01-2018-0091823'
        });
      }
      // Move to landing page
      setActiveView('reference');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipToLanding = () => {
    setActiveView('reference');
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0d14] text-neutral-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Brand Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/80 flex items-center justify-center shadow-lg shadow-black/40 relative">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-0 left-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-0 right-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-0 left-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-0 right-0" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-white font-mono">
                FLEETX
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 tracking-widest uppercase">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono tracking-tight">
              AUTONOMOUS TELEMATICS & DISPATCH
            </p>
          </div>
        </div>

        {/* Database & Cloud Status Badge */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-neutral-400">Firebase Firestore:</span>
            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              READY
            </span>
          </div>
          <button
            onClick={handleSkipToLanding}
            className="text-xs text-neutral-400 hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Skip to Landing Page →
          </button>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full bg-[#111622]/90 backdrop-blur-xl rounded-3xl border border-neutral-800/80 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-9 overflow-hidden relative"
        >
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1: Choose Your Role to Enter FleetX</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Individual Portal Authentication
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Sign in as an <span className="text-amber-300 font-semibold">Owner</span> or <span className="text-cyan-300 font-semibold">Driver</span>. Once authenticated, you will immediately proceed to the FleetX landing page and control hub.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7 max-w-2xl mx-auto">
            {/* Role: Fleet Owner */}
            <div
              onClick={() => handleRoleSelect('Owner')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3.5 ${
                selectedRole === 'Owner'
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/30'
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/70'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedRole === 'Owner' ? 'bg-amber-500 text-black shadow-md' : 'bg-neutral-800 text-neutral-400'
              }`}>
                <Crown className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Fleet Owner / Director
                  </h3>
                  {selectedRole === 'Owner' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-snug">
                  Full telematics, live map tracking, predictive AI, fuel analytics & dispatch control.
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>Full Administrative Privileges</span>
                </div>
              </div>
            </div>

            {/* Role: Commercial Driver */}
            <div
              onClick={() => handleRoleSelect('Driver')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3.5 ${
                selectedRole === 'Driver'
                  ? 'bg-cyan-950/20 border-cyan-500/60 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/70'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedRole === 'Driver' ? 'bg-cyan-400 text-black shadow-md' : 'bg-neutral-800 text-neutral-400'
              }`}>
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Commercial Driver
                  </h3>
                  {selectedRole === 'Driver' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-snug">
                  Vehicle cockpit, HOS compliance clock, pre-trip DVIR checklist & route navigation.
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Assigned Vehicle & Duty Manifest</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form and Google Sign-in Section */}
          <div className="max-w-2xl mx-auto">
            {/* Google Fast Connect */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isFirebaseLoading}
              className="w-full mb-5 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
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
              <span>
                {isFirebaseLoading
                  ? 'Connecting to Google & Firestore...'
                  : `Sign in with Google as ${selectedRole} (Restores Firestore Profile)`}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-[1px] bg-neutral-800" />
              <span className="text-[11px] font-mono uppercase text-neutral-400">
                Or enter credentials
              </span>
              <div className="flex-1 h-[1px] bg-neutral-800" />
            </div>

            {/* Individual Role Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    {selectedRole === 'Owner' ? 'Owner / Director Name' : 'Driver Full Name'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder={selectedRole === 'Owner' ? 'e.g. Rajesh Singhania' : 'e.g. Arun Kumar'}
                      className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={selectedRole === 'Owner' ? 'owner@fleetx.io' : 'arun.k@fleetx.io'}
                      className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Fields based on Role */}
              {selectedRole === 'Owner' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Enterprise Logistics Entity
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Singhania Heavy Logistics Corp"
                      className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Commercial Driver License
                    </label>
                    <div className="relative">
                      <IdCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="TN-01-2018-0091823"
                        className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Assigned Commercial Vehicle
                    </label>
                    <div className="relative">
                      <Truck className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                      <select
                        value={selectedVehicleId}
                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                        className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      >
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.registrationNumber} • {v.model} ({v.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Master Access Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-black flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                  selectedRole === 'Owner'
                    ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'
                    : 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-400/20'
                } disabled:opacity-60`}
              >
                <span>
                  {isSubmitting
                    ? 'Authenticating & Initializing...'
                    : `Sign In as ${selectedRole}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Fast-Logins */}
            <div className="mt-6 pt-5 border-t border-neutral-800">
              <span className="block text-center text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                Fast One-Click Demo Profiles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Owner')}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-amber-500/50 text-left transition-all flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      Rajesh Singhania
                    </div>
                    <div className="text-[10px] text-amber-400/90 truncate">
                      Owner • Singhania Logistics
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Driver')}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-cyan-500/50 text-left transition-all flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      Arun Kumar
                    </div>
                    <div className="text-[10px] text-cyan-400/90 truncate">
                      Driver • TN 01 AB 1234
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer System Status & Telematics Summary */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            128 Commercial Vehicles Monitored
          </span>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <span className="hidden sm:inline text-neutral-400">94.2% On-Time SLA</span>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <span className="hidden sm:inline text-neutral-400">Predictive AI Active</span>
        </div>
        <div className="font-mono text-[11px] text-neutral-400">
          SECURE PROTOCOL v2.4 • FLEETX INTELLIGENCE
        </div>
      </footer>
    </div>
  );
};
