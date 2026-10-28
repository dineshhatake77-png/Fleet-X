import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useFleet } from '../../context/FleetContext';
import { Vehicle, VehicleStatus, GeofenceZone } from '../../types';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Fuel,
  Gauge,
  Clock,
  User,
  AlertTriangle,
  Layers,
  Crosshair,
  Truck,
  Car,
  Bus,
  RefreshCw,
  Compass,
  Globe2,
  Lock,
  Unlock,
  Power,
  Volume2,
  ShieldCheck,
  ShieldAlert,
  Play,
  Pause,
  Download,
  Activity,
  Cpu,
  Radio,
  CarFront
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB9JhCXfsZPYCEIZvCQ9vwUd6ihT4pcHXE';

declare const google: any;

// 1. Google Maps Real-time Traffic Layer Helper
const GoogleTrafficLayer: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    const trafficLayer = new google.maps.TrafficLayer();
    if (enabled) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }
    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, enabled]);
  return null;
};

// 2. Google Maps Geofences Zones Overlay
const GoogleGeofenceOverlays: React.FC<{ geofences: GeofenceZone[]; visible: boolean }> = ({ geofences, visible }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !visible || typeof google === 'undefined') return;
    const circles = geofences.map((geo) => {
      const color = geo.type === 'restricted' ? '#ef4444' : geo.type === 'terminal' ? '#3b82f6' : '#10b981';
      return new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.85,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.16,
        map,
        center: { lat: geo.center.lat, lng: geo.center.lng },
        radius: geo.radiusMeters,
      });
    });
    return () => {
      circles.forEach((c) => c.setMap(null));
    };
  }, [map, geofences, visible]);
  return null;
};

// 3. Google Maps Camera Controller
const GoogleMapController: React.FC<{ targetLocation: { lat: number; lng: number } | null }> = ({ targetLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !targetLocation) return;
    map.panTo(targetLocation);
  }, [map, targetLocation?.lat, targetLocation?.lng]);
  return null;
};

export const LiveTrackingView: React.FC = () => {
  const {
    vehicles,
    selectedVehicle,
    setSelectedVehicle,
    mapProvider,
    setMapProvider,
    googleMapType,
    setGoogleMapType,
    showTrafficLayer,
    setShowTrafficLayer,
    geofences,
    simulationSpeed,
    setSimulationSpeed,
    isDemoMode,
    setIsDemoMode,
    sendRemoteCommand,
    runDiagnosticScan,
    exportAuditReport
  } = useFleet();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSideTab, setActiveSideTab] = useState<'vehicles' | 'teleoperation' | 'geofences' | 'obd'>('vehicles');
  const [isScanningOBD, setIsScanningOBD] = useState(false);
  const [obdScanResult, setObdScanResult] = useState<any>(null);
  const [showGeofences, setShowGeofences] = useState(true);

  // Helper to get truck vehicle image based on type
  const getVehicleTruckImage = (type: string) => {
    switch (type) {
      case 'Van':
        return '/src/assets/images/delivery_fleet_van_1791043388354.jpg';
      case 'Truck':
        return '/src/assets/images/heavy_cargo_truck_1791043370930.jpg';
      default:
        return '/src/assets/images/cyber_truck_hero_1791042836595.jpg';
    }
  };

  // Status color mapper
  const getMarkerColor = (status: VehicleStatus) => {
    switch (status) {
      case 'active':
        return '#10b981'; // Green
      case 'in_transit':
        return '#3b82f6'; // Blue
      case 'warning':
        return '#f59e0b'; // Amber
      case 'critical':
        return '#ef4444'; // Red
      case 'maintenance':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (typeFilter !== 'all' && v.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        v.registrationNumber.toLowerCase().includes(q) ||
        v.vehicleId.toLowerCase().includes(q) ||
        (v.driverName && v.driverName.toLowerCase().includes(q)) ||
        v.model.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Center map on selected vehicle
  const targetVeh = selectedVehicle || filteredVehicles[0];

  // Leaflet Map Init (When OSM mode is active)
  useEffect(() => {
    if (mapProvider !== 'osm') {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
      }
      return;
    }

    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [targetVeh ? targetVeh.currentLocation.lat : 12.9716, targetVeh ? targetVeh.currentLocation.lng : 79.1500],
      zoom: 8,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapProvider]);

  // Update Leaflet Markers
  useEffect(() => {
    if (mapProvider !== 'osm') return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentMarkerIds = new Set<string>();

    filteredVehicles.forEach((vehicle) => {
      currentMarkerIds.add(vehicle.id);
      const color = getMarkerColor(vehicle.status);
      const isSelected = selectedVehicle?.id === vehicle.id;

      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); cursor: pointer;">
          <div style="
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            background: #0f172a;
            border: 3px solid ${color};
            border-radius: 50%;
            box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 17h4V5H10zM14 17l4 4M10 17l-4 4M12 2v3"/>
            </svg>
          </div>
          <span style="
            position: absolute;
            bottom: -18px;
            background: rgba(15,23,42,0.92);
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 6px;
            white-space: nowrap;
            letter-spacing: 0.5px;
            border: 1px solid rgba(255,255,255,0.15);
          ">${vehicle.registrationNumber}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-vehicle-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      if (markersRef.current[vehicle.id]) {
        const marker = markersRef.current[vehicle.id];
        marker.setLatLng([vehicle.currentLocation.lat, vehicle.currentLocation.lng]);
        marker.setIcon(customIcon);
      } else {
        const marker = L.marker([vehicle.currentLocation.lat, vehicle.currentLocation.lng], { icon: customIcon })
          .addTo(map)
          .on('click', () => setSelectedVehicle(vehicle));
        markersRef.current[vehicle.id] = marker;
      }
    });

    Object.keys(markersRef.current).forEach((id) => {
      if (!currentMarkerIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [filteredVehicles, selectedVehicle, mapProvider]);

  const handleCenterVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    if (mapProvider === 'osm' && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([v.currentLocation.lat, v.currentLocation.lng], 13, { duration: 1.2 });
    }
  };

  const handleTriggerOBDScan = async () => {
    if (!targetVeh) return;
    setIsScanningOBD(true);
    const res = await runDiagnosticScan(targetVeh.id);
    setTimeout(() => {
      setObdScanResult(res);
      setIsScanningOBD(false);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-[#e9edf2]">
      {/* 1. Left Multi-Functional Operations Panel */}
      <div className="w-full lg:w-[410px] bg-white border-r border-neutral-200/80 flex flex-col z-10 shadow-lg flex-shrink-0">

        {/* Panel Header & Module Switcher Tabs */}
        <div className="p-3 border-b border-neutral-200 bg-[#f8fafc]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-sm text-neutral-900 tracking-tight">Telematics Command Hub</h2>
            </div>
            {/* Map Provider Switcher */}
            <div className="flex items-center bg-neutral-200 p-0.5 rounded-full text-[10px] font-bold">
              <button
                onClick={() => setMapProvider('google')}
                className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                  mapProvider === 'google' ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Globe2 className="w-3 h-3" />
                <span>Google Maps</span>
              </button>
              <button
                onClick={() => setMapProvider('osm')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  mapProvider === 'osm' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                OSM Radar
              </button>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold">
            {[
              { id: 'vehicles', label: 'Vehicles' },
              { id: 'teleoperation', label: 'Security' },
              { id: 'geofences', label: 'Geofences' },
              { id: 'obd', label: 'OBD-II' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSideTab(tab.id as any)}
                className={`py-1.5 rounded-xl transition-all text-center ${
                  activeSideTab === tab.id
                    ? 'bg-white shadow-xs text-neutral-900 font-bold border border-neutral-200'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Vehicle List & Filters */}
        {activeSideTab === 'vehicles' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search & Status Filters */}
            <div className="p-3 border-b border-neutral-100 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicle, driver, model..."
                  className="w-full bg-[#f2f4f8] text-xs rounded-xl pl-8 pr-3 py-1.5 border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                {['all', 'in_transit', 'active', 'warning', 'critical', 'maintenance'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {st === 'in_transit' ? 'In Transit' : st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2 space-y-1">
              {filteredVehicles.map((vehicle) => {
                const isSelected = selectedVehicle?.id === vehicle.id;
                const color = getMarkerColor(vehicle.status);

                return (
                  <div
                    key={vehicle.id}
                    onClick={() => handleCenterVehicle(vehicle)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected ? 'bg-neutral-900 text-white shadow-md' : 'hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-bold text-xs tracking-wider font-mono">{vehicle.registrationNumber}</span>
                        {vehicle.isEngineImmobilized && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold">
                            LOCKED
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200/60 text-neutral-700'
                      }`}>
                        {vehicle.type}
                      </span>
                    </div>

                    <div className={`text-[11px] mb-2 truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {vehicle.driverName || 'No driver'} • {vehicle.destination || 'Corridor En Route'}
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-neutral-200/20 text-[10px]">
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-cyan-400" />
                        <span>{vehicle.speed} km/h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-emerald-400" />
                        <span>{vehicle.fuelLevel}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{vehicle.etaMinutes}m ETA</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Remote Fleet Teleoperation & Security Controls */}
        {activeSideTab === 'teleoperation' && targetVeh && (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
            <div className="p-3.5 rounded-2xl bg-neutral-900 text-white border border-neutral-800">
              <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold">TARGET UNIT</span>
              <div className="font-bold text-sm font-mono mt-0.5">{targetVeh.registrationNumber} ({targetVeh.model})</div>
              <div className="text-[11px] text-cyan-400 mt-1">Driver: {targetVeh.driverName || 'Unassigned'}</div>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-700">
                Over-The-Air Commands
              </div>

              {/* Engine Immobilizer */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900">Remote Engine Kill-Switch</div>
                  <div className="text-[10px] text-neutral-400">Anti-theft fuel line and ignition cutoff</div>
                </div>
                <button
                  onClick={() => sendRemoteCommand(targetVeh.id, 'immobilize')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    targetVeh.isEngineImmobilized
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{targetVeh.isEngineImmobilized ? 'Restore Ignition' : 'Immobilize'}</span>
                </button>
              </div>

              {/* Speed Governor */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-neutral-900">Speed Governor Limiter</div>
                    <div className="text-[10px] text-neutral-400">Enforce maximum speed envelope</div>
                  </div>
                  <span className="font-bold text-xs font-mono text-blue-600">
                    {targetVeh.speedGovernorLimit || 80} km/h
                  </span>
                </div>
                <div className="flex gap-2">
                  {[50, 60, 75, 90].map((lim) => (
                    <button
                      key={lim}
                      onClick={() => sendRemoteCommand(targetVeh.id, 'speed_limit', lim)}
                      className={`flex-1 py-1 rounded-xl font-bold font-mono text-[11px] transition-colors ${
                        targetVeh.speedGovernorLimit === lim
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {lim} km/h
                    </button>
                  ))}
                </div>
              </div>

              {/* Central Door Lock */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900">Cargo & Cab Central Locks</div>
                  <div className="text-[10px] text-neutral-400">
                    Status: {targetVeh.isDoorLocked ? 'Locked (Secure)' : 'Unlocked'}
                  </div>
                </div>
                <button
                  onClick={() => sendRemoteCommand(targetVeh.id, targetVeh.isDoorLocked ? 'unlock' : 'lock')}
                  className="px-3 py-1.5 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {targetVeh.isDoorLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{targetVeh.isDoorLocked ? 'Unlock Cab' : 'Lock Cab'}</span>
                </button>
              </div>

              {/* Emergency Beacon Horn */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900">Trigger Fleet Warning Horn & Flasher</div>
                  <div className="text-[10px] text-neutral-400">Emits 5-second acoustic & LED strobe</div>
                </div>
                <button
                  onClick={() => sendRemoteCommand(targetVeh.id, 'horn')}
                  className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Chirp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Geofences */}
        {activeSideTab === 'geofences' && (
          <div className="p-4 space-y-3 flex-1 overflow-y-auto text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-neutral-700">
                Active Geofence Boundaries
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {geofences.length} ACTIVE ZONES
              </span>
            </div>

            {geofences.map((geo) => (
              <div key={geo.id} className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-neutral-900">{geo.name}</h4>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      geo.type === 'restricted'
                        ? 'bg-rose-100 text-rose-700'
                        : geo.type === 'terminal'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {geo.type}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  Radius: <strong>{geo.radiusMeters}m</strong> • Max Allowed: <strong>{geo.speedLimitKmH} km/h</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-600 border-t border-neutral-100">
                  <span>Vehicles inside perimeter:</span>
                  <strong className="text-neutral-900 font-mono">{geo.activeVehiclesCount} units</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: OBD-II CAN-Bus Telemetry Scanner */}
        {activeSideTab === 'obd' && targetVeh && (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
            <div className="p-3 rounded-2xl bg-neutral-900 text-white">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">ECU LIVE LINK</div>
              <div className="font-bold text-sm font-mono mt-0.5">{targetVeh.registrationNumber}</div>
              <div className="text-[10px] text-emerald-400 mt-1">● CAN-Bus Baud 500k Connected</div>
            </div>

            <button
              onClick={handleTriggerOBDScan}
              disabled={isScanningOBD}
              className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Cpu className="w-4 h-4" />
              <span>{isScanningOBD ? 'Querying CAN-Bus...' : 'Run Full ECU Diagnostic Scan'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                <div className="text-[9px] text-neutral-400 uppercase font-bold">Engine RPM</div>
                <div className="font-mono font-bold text-sm text-neutral-900">
                  {targetVeh.speed > 0 ? 1400 + targetVeh.speed * 12 : 650}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                <div className="text-[9px] text-neutral-400 uppercase font-bold">Fuel Rail Press.</div>
                <div className="font-mono font-bold text-sm text-blue-600">1,820 bar</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                <div className="text-[9px] text-neutral-400 uppercase font-bold">Coolant Temp</div>
                <div className="font-mono font-bold text-sm text-amber-600">{targetVeh.engineTemp}°C</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                <div className="text-[9px] text-neutral-400 uppercase font-bold">Battery Bus</div>
                <div className="font-mono font-bold text-sm text-emerald-600">{targetVeh.batteryVoltage} V</div>
              </div>
            </div>

            {obdScanResult && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>DTC Fault Codes Found (2)</span>
                </div>
                {obdScanResult.codes.map((c: any) => (
                  <div key={c.code} className="bg-white p-2 rounded-xl border border-amber-200/80">
                    <span className="font-mono font-bold text-neutral-900 text-xs">{c.code}</span>
                    <p className="text-[10px] text-neutral-600 mt-0.5">{c.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Simulation Controller & Export */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="p-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
              title="Pause/Play Simulation"
            >
              {isDemoMode ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded ${simulationSpeed === spd ? 'bg-black text-white font-bold' : 'bg-neutral-200 text-neutral-700'}`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={exportAuditReport}
            className="px-3 py-1 rounded-full bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold text-[10px] flex items-center gap-1 shadow-xs"
          >
            <Download className="w-3 h-3" />
            <span>Export Audit Log</span>
          </button>
        </div>

      </div>

      {/* 2. Map Canvas (Google Maps or OpenStreetMap) */}
      <div className="flex-1 relative h-full">

        {/* A. Live Google Maps Integration */}
        {mapProvider === 'google' ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              defaultCenter={{ lat: targetVeh ? targetVeh.currentLocation.lat : 12.9716, lng: targetVeh ? targetVeh.currentLocation.lng : 79.1500 }}
              defaultZoom={8}
              mapId="DEMO_MAP_ID"
              mapTypeId={googleMapType}
              className="w-full h-full"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              {/* Traffic Layer */}
              <GoogleTrafficLayer enabled={showTrafficLayer} />

              {/* Geofence zones */}
              <GoogleGeofenceOverlays geofences={geofences} visible={showGeofences} />

              {/* Camera Pan Controller */}
              <GoogleMapController targetLocation={targetVeh ? { lat: targetVeh.currentLocation.lat, lng: targetVeh.currentLocation.lng } : null} />

              {filteredVehicles.map((veh) => {
                const color = getMarkerColor(veh.status);
                const isSelected = selectedVehicle?.id === veh.id;

                return (
                  <AdvancedMarker
                    key={veh.id}
                    position={{ lat: veh.currentLocation.lat, lng: veh.currentLocation.lng }}
                    onClick={() => setSelectedVehicle(veh)}
                    title={`${veh.registrationNumber} - ${veh.speed} km/h`}
                  >
                    <div className="flex flex-col items-center cursor-pointer group">
                      <div
                        className={`w-9 h-9 rounded-full bg-slate-900 border-2 flex items-center justify-center text-white shadow-xl transition-transform ${
                          isSelected ? 'scale-125 ring-4 ring-blue-500/40' : 'group-hover:scale-110'
                        }`}
                        style={{ borderColor: color }}
                      >
                        <Truck className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="mt-1 bg-slate-900/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow border border-white/20 whitespace-nowrap">
                        {veh.registrationNumber} • {veh.speed}k
                      </span>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </GoogleMap>
          </APIProvider>
        ) : (
          /* B. Leaflet OSM Canvas */
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        )}

        {/* Map Type, Traffic & Geofence Layer Switcher at Map Top-Right */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-neutral-200 z-10 flex items-center gap-2 text-xs flex-wrap max-w-xl">
          {mapProvider === 'google' && (
            <>
              {/* Google Map Type Selector */}
              <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl text-[11px] font-semibold">
                {(['roadmap', 'satellite', 'hybrid', 'terrain'] as const).map((mType) => (
                  <button
                    key={mType}
                    onClick={() => setGoogleMapType(mType)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      googleMapType === mType ? 'bg-white text-black font-bold shadow-xs' : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {mType}
                  </button>
                ))}
              </div>

              {/* Google Live Traffic Layer Toggle */}
              <button
                onClick={() => setShowTrafficLayer(!showTrafficLayer)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  showTrafficLayer ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
                title="Toggle Google Real-Time Traffic Layer"
              >
                <span className={`w-2 h-2 rounded-full ${showTrafficLayer ? 'bg-white animate-ping' : 'bg-neutral-400'}`} />
                <span>Traffic {showTrafficLayer ? 'ON' : 'OFF'}</span>
              </button>

              {/* Geofences Zones Toggle */}
              <button
                onClick={() => setShowGeofences(!showGeofences)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  showGeofences ? 'bg-blue-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
                title="Toggle Geofence Zones on Map"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Geofences</span>
              </button>
            </>
          )}

          {/* Reset / Center on Fleet button */}
          <button
            onClick={() => {
              if (filteredVehicles[0]) {
                handleCenterVehicle(filteredVehicles[0]);
              }
            }}
            className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
            title="Center Map on Fleet"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Switch Provider */}
          <button
            onClick={() => setMapProvider(mapProvider === 'google' ? 'osm' : 'google')}
            className="px-3 py-1 rounded-xl bg-black text-white text-[11px] font-bold flex items-center gap-1 hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{mapProvider === 'google' ? 'Switch to OSM' : 'Switch to Google Map'}</span>
          </button>
        </div>

        {/* Selected Vehicle Float Card at Map Bottom with Real Truck Image Thumbnail */}
        {selectedVehicle && (
          <div className="absolute bottom-6 left-6 right-6 lg:left-8 lg:right-auto lg:w-[500px] bg-neutral-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-neutral-700 z-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex items-center gap-3">
                {/* Truck Photo Thumbnail */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 flex-shrink-0 border border-white/20 shadow-md">
                  <img
                    src={getVehicleTruckImage(selectedVehicle.type)}
                    alt={selectedVehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: getMarkerColor(selectedVehicle.status) }}
                    />
                    <h3 className="font-bold text-sm font-mono tracking-wider">{selectedVehicle.registrationNumber}</h3>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-white/20 font-mono">
                      {selectedVehicle.model}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Driver: <strong className="text-white">{selectedVehicle.driverName || 'Unassigned'}</strong> • {selectedVehicle.currentLocation.address}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => setActiveSideTab('teleoperation')}
                      className="text-[10px] font-bold text-rose-400 hover:text-rose-300 underline flex items-center gap-1"
                    >
                      <Lock className="w-2.5 h-2.5" /> Security Commands
                    </button>
                    <span className="text-neutral-600">•</span>
                    <button
                      onClick={() => setActiveSideTab('obd')}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
                    >
                      <Cpu className="w-2.5 h-2.5" /> OBD-II Diagnostics
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-neutral-400 hover:text-white text-sm p-1 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center bg-black/40 p-2.5 rounded-2xl border border-neutral-800 text-xs">
              <div>
                <div className="text-[10px] text-neutral-400">SPEED</div>
                <div className="font-bold text-cyan-400 font-mono">{selectedVehicle.speed} km/h</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400">FUEL</div>
                <div className="font-bold text-emerald-400 font-mono">{selectedVehicle.fuelLevel}%</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400">TEMP</div>
                <div className="font-bold text-amber-400 font-mono">{selectedVehicle.engineTemp}°C</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400">HEALTH</div>
                <div className="font-bold text-purple-400 font-mono">{selectedVehicle.healthScore}%</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
