import React from 'react';
import { motion } from 'motion/react';
import { useFleet } from '../../context/FleetContext';
import {
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Radio,
  Menu,
  ChevronRight,
  Gauge,
  MapPin,
  Truck,
  Fuel,
  Lock,
  Compass,
  AlertTriangle,
  RotateCw,
  Zap,
  Globe2,
  Calendar,
  CheckCircle2,
  LogOut,
  Crown
} from 'lucide-react';

export const ReferenceHeroView: React.FC = () => {
  const {
    setActiveView,
    stats,
    vehicles,
    unreadAlertsCount,
    isDemoMode,
    setIsDemoMode,
    setIsAuthModalOpen,
    currentUser,
    logoutUser,
    setMapProvider
  } = useFleet();

  const handleLaunchGoogleMap = () => {
    setMapProvider('google');
    setActiveView('tracking');
  };

  return (
    <div className="w-full min-h-screen bg-[#c8ceda] p-3 md:p-6 lg:p-8 font-sans overflow-x-hidden">
      {/* Top Welcome / Authenticated Session Banner */}
      <div className="w-full max-w-[1440px] mx-auto mb-3.5 flex flex-wrap items-center justify-between gap-3 bg-neutral-900 text-white px-5 py-2.5 rounded-2xl shadow-lg border border-neutral-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-neutral-400 font-medium">Session:</span>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{currentUser.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
                currentUser.role === 'Owner'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {currentUser.role === 'Owner' ? <Crown className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                <span>{currentUser.role}</span>
              </span>
              {currentUser.role === 'Driver' && currentUser.assignedVehicleReg && (
                <span className="text-neutral-400 font-mono text-[11px]">
                  ({currentUser.assignedVehicleReg})
                </span>
              )}
            </div>
          ) : (
            <span className="text-neutral-400 italic">Guest Session</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'Driver' && (
            <button
              onClick={() => setActiveView('driver-portal')}
              className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Driver Cockpit</span>
            </button>
          )}
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-3.5 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              logoutUser();
              setActiveView('login');
            }}
            className="px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Return to Individual Login Screen"
          >
            <LogOut className="w-3 h-3" />
            <span>Switch / Sign Out</span>
          </button>
        </div>
      </div>

      {/* 1. Main Reference Design Canvas (Exact layout preserved with new Truck imagery & micro-animations) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-[1440px] mx-auto bg-white rounded-[38px] md:rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] p-4 md:p-7 lg:p-8 border border-neutral-200/70 relative overflow-hidden flex flex-col lg:flex-row gap-5 lg:gap-7 min-h-[780px]"
      >
        {/* Left Vertical Capsule Sidebar */}
        <aside className="bg-black text-white w-full lg:w-20 rounded-[30px] lg:rounded-full py-5 lg:py-8 px-4 flex lg:flex-col justify-between items-center shadow-2xl flex-shrink-0 z-20">
          {/* Top Logo Icon with subtle continuous rotation animation */}
          <motion.div
            whileHover={{ scale: 1.15, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 260 }}
            onClick={() => setActiveView('dashboard')}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer group"
            title="FleetX Telematics Dashboard"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white absolute top-0 left-0 transition-transform group-hover:scale-125" />
              <span className="w-2 h-2 rounded-full bg-white absolute top-0 right-0 transition-transform group-hover:scale-125" />
              <span className="w-2 h-2 rounded-full bg-white absolute bottom-0 left-0 transition-transform group-hover:scale-125" />
              <span className="w-2 h-2 rounded-full bg-white absolute bottom-0 right-0 transition-transform group-hover:scale-125" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </motion.div>

          {/* Vertically Rotated Brand Text */}
          <div className="hidden lg:flex items-center justify-center my-auto">
            <span
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              className="tracking-[0.45em] text-[11px] font-semibold text-neutral-300 uppercase select-none hover:text-white transition-colors cursor-pointer"
              onClick={() => setActiveView('dashboard')}
            >
              FLEETX • TELEMATICS
            </span>
          </div>

          {/* Mobile view quick nav buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/20 text-white"
            >
              Dashboard
            </button>
            <button
              onClick={handleLaunchGoogleMap}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-600 text-white flex items-center gap-1"
            >
              <Globe2 className="w-3 h-3" />
              <span>Google Map</span>
            </button>
          </div>

          {/* Bottom Profile Section */}
          <div
            onClick={() => setIsAuthModalOpen(true)}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            title="User Profile / Sign In"
          >
            <span
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              className="hidden lg:block tracking-[0.25em] text-[9px] font-semibold text-neutral-400 group-hover:text-white uppercase transition-colors"
            >
              MY PROFILE
            </span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-cyan-400 transition-colors relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black animate-pulse" />
            </div>
          </div>
        </aside>

        {/* Middle Content Column */}
        <div className="flex-1 flex flex-col justify-between py-2 px-1 lg:px-4 z-10">

          {/* Upper Section */}
          <div>
            {/* Top-Left Card: Modern Truck Thumbnail + Text + Capsule Buttons */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-[#ebeef3] p-4 md:p-5 rounded-[28px] md:rounded-[34px] flex flex-col sm:flex-row items-center sm:items-start gap-4 max-w-xl border border-neutral-300/40 shadow-sm mb-6 lg:mb-8"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-300 shadow-inner group relative">
                <img
                  src="/src/assets/images/cyber_truck_thumb_1791042853200.jpg"
                  alt="Autonomous Electric Fleet Transport"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
              </div>
              <div className="flex flex-col justify-between h-full text-center sm:text-left">
                <p className="text-neutral-700 text-xs md:text-sm leading-relaxed font-normal mb-3">
                  This is the latest telematics engine that allows real-time autonomous routing, predictive maintenance, and live fleet intelligence powered by Google Maps.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('dashboard')}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-black text-black font-semibold text-xs tracking-wider uppercase hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    EXPLORE MORE
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLaunchGoogleMap}
                    className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                    title="Live Google Maps Access"
                  >
                    <span className="text-[10px] font-bold tracking-tighter">›››</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Milestones / Status Timeline */}
            <div className="relative pl-6 mb-6 lg:mb-8 font-sans">
              <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-neutral-300" />

              {/* Milestone 06 */}
              <div className="relative mb-5 group cursor-pointer" onClick={handleLaunchGoogleMap}>
                <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-neutral-400 group-hover:border-black transition-colors" />
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold tracking-wider text-neutral-900 uppercase">06 – LAUNCH</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">GOOGLE MAPS LIVE</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-normal">Real-time GPS tracking with satellite hybrid & traffic layers</p>
              </div>

              {/* Milestone 05 */}
              <div className="relative group cursor-pointer" onClick={() => setActiveView('maintenance')}>
                <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-black ring-4 ring-neutral-200 animate-pulse" />
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold tracking-wider text-neutral-900 uppercase">05 – LIVE OPS</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-normal">Predictive maintenance & remote teleoperation active</p>
              </div>
            </div>

            {/* Capsule Pill Tags (2 Rows) */}
            <div className="flex flex-wrap gap-2 mb-8 max-w-lg">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('maintenance')}
                className="px-4 py-2 rounded-full border border-black/80 text-[11px] font-semibold text-black tracking-wider uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                ARTIFICIAL INTELLIGENCE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLaunchGoogleMap}
                className="px-4 py-2 rounded-full border border-black/80 text-[11px] font-semibold text-black tracking-wider uppercase hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Globe2 className="w-3 h-3 text-blue-600" />
                <span>GOOGLE MAPS</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('fuel')}
                className="px-4 py-2 rounded-full border border-black/80 text-[11px] font-semibold text-black tracking-wider uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                FUEL AI
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('vehicles')}
                className="px-4 py-2 rounded-full border border-black/80 text-[11px] font-semibold text-black tracking-wider uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                FLEET TRUCKS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('routes')}
                className="px-4 py-2 rounded-full border border-black/80 text-[11px] font-semibold text-black tracking-wider uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                CORRIDOR RADAR
              </motion.button>
            </div>
          </div>

          {/* Bottom Headline Area */}
          <div className="pt-4 border-t border-neutral-200/60">
            <p className="text-[10px] md:text-[11px] font-bold tracking-[0.18em] text-neutral-700 uppercase mb-2">
              TECHNOLOGIES THAT WILL ALLOW US TO DO THE IMPOSSIBLE IN THE NEAR FUTURE.
            </p>

            {/* Giant Title: Futuristic ◓ ✱ technologies */}
            <div className="leading-[0.92] select-none">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-black font-sans">
                  Futuristic
                </h1>
                <motion.span
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-6 h-3 sm:w-8 sm:h-4 md:w-10 md:h-5 bg-black rounded-t-full -mt-2 self-center shadow-sm"
                />
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-3xl sm:text-4xl md:text-5xl text-black font-bold -mt-1"
                >
                  ✱
                </motion.span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-black font-sans">
                technologies
              </h1>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView('dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-all shadow-md group"
              >
                <span>OPEN OPERATIONS CENTER</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLaunchGoogleMap}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>LIVE GOOGLE MAP</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView('maintenance')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs tracking-wider uppercase transition-colors border border-neutral-300"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-600" />
                <span>PREDICTIVE AI</span>
              </motion.button>
            </div>
          </div>

        </div>

        {/* Right Visual Cutout Frame (Featuring Modern Heavy Transport Truck Hero Asset) */}
        <div className="flex-1 rounded-[32px] md:rounded-[42px] bg-[#d9dfe7] relative overflow-hidden flex flex-col justify-between min-h-[460px] lg:min-h-[640px] border border-neutral-300/60 shadow-inner group">

          {/* High-Resolution Futuristic Aerodynamic Transport Truck Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/cyber_truck_hero_1791042836595.jpg"
              alt="Futuristic Aerodynamic Commercial Fleet Truck"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Ambient vignette and high-tech glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          </div>

          {/* Top Bar inside image frame */}
          <div className="relative z-10 p-5 md:p-6 flex items-start justify-between">
            {/* White Double-Trapezoid Emblem (Exact replica from reference image) */}
            <div
              onClick={() => setActiveView('dashboard')}
              className="cursor-pointer hover:opacity-90 transition-opacity"
              title="FleetX Logistics Engine"
            >
              <svg width="84" height="64" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                <polygon points="30,0 70,0 90,32 10,32" fill="#FFFFFF" />
                <polygon points="20,38 80,38 100,72 0,72" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Circular Black MENU Button (Top Right) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveView('dashboard')}
              className="w-14 h-14 rounded-full bg-black text-white hover:bg-neutral-800 transition-all flex items-center justify-center shadow-xl group/btn"
              title="Open Navigation Menu"
            >
              <span className="text-[11px] font-bold tracking-widest uppercase transition-transform group-hover/btn:scale-105">
                MENU
              </span>
            </motion.button>
          </div>

          {/* Floating Live Telemetry HUD Chip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 mx-5 md:mx-6 mb-3 bg-black/80 backdrop-blur-md border border-white/20 text-white p-3.5 rounded-2xl max-w-sm shadow-2xl"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-300">
                  REAL-TIME TELEMETRICS
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                128 TRUCKS SYNCED
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-white/10">
              <div>
                <div className="text-[10px] text-neutral-400">ACTIVE</div>
                <div className="text-sm font-bold text-white font-mono">94</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400">AVG SPEED</div>
                <div className="text-sm font-bold text-cyan-400 font-mono">54 km/h</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400">HEALTH</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">92%</div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Barcode & Copyright Bar */}
          <div className="relative z-10 p-5 md:p-6 flex items-end justify-end">
            <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <div className="flex items-center gap-[3px] text-white">
                <span className="w-[2px] h-5 bg-white inline-block" />
                <span className="w-[1px] h-5 bg-white inline-block" />
                <span className="w-[3px] h-5 bg-white inline-block" />
                <span className="w-[1.5px] h-5 bg-white inline-block" />
                <span className="w-[2.5px] h-5 bg-white inline-block" />
                <span className="w-[1px] h-5 bg-white inline-block" />
                <span className="w-[4px] h-5 bg-white inline-block" />
              </div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-white">
                ALL RIGHTS RESERVED ®
              </span>
            </div>
          </div>

        </div>

      </motion.div>

      {/* 2. Scroll Animation Showcase Sections (Smooth reveal as user scrolls down) */}
      <div className="max-w-[1440px] mx-auto mt-12 space-y-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-[11px] font-mono font-bold tracking-widest text-neutral-600 uppercase bg-white/70 px-4 py-1.5 rounded-full border border-neutral-300">
            ENTERPRISE PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mt-4">
            Next-Generation Fleet Infrastructure
          </h2>
          <p className="text-neutral-600 text-sm mt-2">
            Integrated telematics suite unifying Google Maps routing, live CAN-bus diagnostics, predictive failure AI, and remote teleoperation.
          </p>
        </motion.div>

        {/* Feature Cards Grid with Staggered Scroll Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Feature 1: Live Google Maps Telematics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-neutral-900 mb-2">Live Google Maps Platform</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Full Google Maps integration with Roadmap, Satellite Hybrid, real-time Google Traffic layers, Advanced Markers, and corridor waypoints.
              </p>
            </div>
            <button
              onClick={handleLaunchGoogleMap}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-blue-700"
            >
              <span>Explore Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Feature 2: Predictive Maintenance ML */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-neutral-900 mb-2">Predictive Maintenance AI</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Rule-based ML diagnostic architecture analyzing coolant thermal stress, braking deceleration shocks, and engine wear to forecast repairs.
              </p>
            </div>
            <button
              onClick={() => setActiveView('maintenance')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-amber-600 group-hover:text-amber-700"
            >
              <span>View Predictions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Feature 3: Remote Speed Governor & Engine Kill */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-neutral-900 mb-2">Remote Teleoperation & Security</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Over-the-air commands to set speed governors (60 km/h limiter), remotely immobilize engines in emergency theft situations, and trigger sirens.
              </p>
            </div>
            <button
              onClick={() => setActiveView('tracking')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-rose-600 group-hover:text-rose-700"
            >
              <span>Security Commands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Feature 4: Driver Scoring & ELD / HOS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -6 }}
            className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-neutral-900 mb-2">Driver Intelligence & ELD HOS</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Telematics safety scoring assessing harsh braking, cornering, idling time, plus Electronic Logging Device mandated rest countdowns.
              </p>
            </div>
            <button
              onClick={() => setActiveView('drivers')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:text-emerald-700"
            >
              <span>Driver Scoring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Feature 5: Heuristic Corridor Optimizer */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -6 }}
            className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-neutral-900 mb-2">Corridor Route Optimization</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Dynamic route replanning calculating fuel savings (-12% deadhead mileage), estimated traffic delays, and toll cost reductions.
              </p>
            </div>
            <button
              onClick={() => setActiveView('routes')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-purple-600 group-hover:text-purple-700"
            >
              <span>Optimize Corridors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Feature 6: Fuel Anomaly & Green Fleet ESG */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ y: -6 }}
            className="bg-white p-7 rounded-[32px] border border-neutral-200/80 shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Fuel className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-neutral-900 mb-2">Fuel Analytics & ESG Carbon</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Cost-per-kilometer monitoring, automatic detection of excessive consumption anomalies, and carbon footprint reduction tracking.
              </p>
            </div>
            <button
              onClick={() => setActiveView('fuel')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-cyan-600 group-hover:text-cyan-700"
            >
              <span>Fuel Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

        </div>

        {/* Scroll CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-900 text-white rounded-[38px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="max-w-xl z-10">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              READY FOR DEPLOYMENT
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              Start Monitoring Your Commercial Fleet Today
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm mt-2">
              Full MERN REST APIs connected to real-time telemetry streaming, interactive Google Maps, and automated failure prevention.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap z-10">
            <button
              onClick={handleLaunchGoogleMap}
              className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 shadow-lg"
            >
              <Globe2 className="w-4 h-4" />
              <span>Launch Google Maps Live</span>
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors shadow-lg"
            >
              Open Dashboard
            </button>
          </div>

          {/* Background ambient gradient */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

      </div>
    </div>
  );
};
