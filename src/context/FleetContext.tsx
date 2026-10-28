import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Vehicle,
  Driver,
  Route,
  Delivery,
  MaintenanceRecord,
  MaintenancePrediction,
  FuelRecord,
  Alert,
  FleetStats,
  User,
  UserRole,
  GeofenceZone
} from '../types';
import { api } from '../services/api';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_DELIVERIES,
  INITIAL_MAINTENANCE,
  INITIAL_PREDICTIONS,
  INITIAL_FUEL_RECORDS,
  INITIAL_ALERTS,
  INITIAL_USERS,
  INITIAL_GEOFENCES
} from '../data/seedData';
import { simulateVehicleTelemetryStep } from '../services/gpsSimulator';
import {
  auth,
  signInWithGooglePopup,
  logOutFirebase,
  fetchUserProfile,
  saveUserProfile,
  testConnection,
  FirestoreUserData
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type ActiveView =
  | 'login'
  | 'reference'
  | 'dashboard'
  | 'tracking'
  | 'vehicles'
  | 'drivers'
  | 'routes'
  | 'deliveries'
  | 'maintenance'
  | 'fuel'
  | 'geofences'
  | 'security'
  | 'diagnostics'
  | 'alerts'
  | 'reports'
  | 'settings'
  | 'driver-portal';

interface FleetContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  setUserRole: (role: UserRole) => void;
  isFirebaseLoading: boolean;
  authToast: { message: string; type: 'success' | 'info' | 'error' } | null;
  setAuthToast: (t: { message: string; type: 'success' | 'info' | 'error' } | null) => void;
  loginWithGoogle: (preferredRole?: 'Owner' | 'Driver', targetView?: ActiveView) => Promise<void>;
  loginAsOwner: (credentials?: { email?: string; name?: string; company?: string }, targetView?: ActiveView) => Promise<void>;
  loginAsDriver: (credentials?: { email?: string; name?: string; vehicleId?: string; licenseNumber?: string }, targetView?: ActiveView) => Promise<void>;
  logoutUser: () => Promise<void>;
  updateDriverDutyStatus: (status: 'available' | 'driving' | 'break' | 'offline') => Promise<void>;
  stats: FleetStats | null;
  vehicles: Vehicle[];
  drivers: Driver[];
  routes: Route[];
  deliveries: Delivery[];
  maintenance: MaintenanceRecord[];
  predictions: MaintenancePrediction[];
  fuelRecords: FuelRecord[];
  fuelAnalytics: any;
  alerts: Alert[];
  unreadAlertsCount: number;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  selectedDriver: Driver | null;
  setSelectedDriver: (d: Driver | null) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
  // Map settings
  mapProvider: 'google' | 'osm';
  setMapProvider: (p: 'google' | 'osm') => void;
  googleMapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  setGoogleMapType: (t: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => void;
  showTrafficLayer: boolean;
  setShowTrafficLayer: (s: boolean) => void;
  geofences: GeofenceZone[];
  simulationSpeed: number;
  setSimulationSpeed: (spd: number) => void;
  // Modal states
  isAddVehicleOpen: boolean;
  setIsAddVehicleOpen: (open: boolean) => void;
  isAddDriverOpen: boolean;
  setIsAddDriverOpen: (open: boolean) => void;
  isAddDeliveryOpen: boolean;
  setIsAddDeliveryOpen: (open: boolean) => void;
  isScheduleMaintenanceOpen: boolean;
  setIsScheduleMaintenanceOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  // Actions
  addVehicle: (vehicleData: Partial<Vehicle>) => Promise<void>;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addDriver: (driverData: Partial<Driver>) => Promise<void>;
  addDelivery: (deliveryData: Partial<Delivery>) => Promise<void>;
  updateDeliveryStatus: (id: string, status: any) => Promise<void>;
  addMaintenance: (maintenanceData: Partial<MaintenanceRecord>) => Promise<void>;
  optimizeRoute: (routeId: string) => Promise<any>;
  markAlertRead: (id: string) => Promise<void>;
  refreshAllData: () => Promise<void>;
  sendRemoteCommand: (vehicleId: string, command: 'immobilize' | 'speed_limit' | 'lock' | 'unlock' | 'horn', value?: any) => Promise<void>;
  runDiagnosticScan: (vehicleId: string) => Promise<any>;
  exportAuditReport: () => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState<FleetStats | null>({
    totalVehicles: 128,
    activeVehicles: 94,
    inTransitVehicles: 64,
    maintenanceVehicles: 8,
    warningVehicles: 3,
    totalDrivers: 45,
    activeDrivers: 38,
    deliveriesToday: 342,
    completedDeliveriesToday: 315,
    onTimeRate: 94.2,
    fleetEfficiency: 92.4,
    totalFuelUsedLiters: 4820,
    totalFuelCost: 472360,
    avgConsumption: 14.2,
    carbonSavedKg: 1420,
    geofenceEventsToday: 18
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE);
  const [predictions, setPredictions] = useState<MaintenancePrediction[]>(INITIAL_PREDICTIONS);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>(INITIAL_FUEL_RECORDS);
  const [fuelAnalytics, setFuelAnalytics] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [geofences, setGeofences] = useState<GeofenceZone[]>(INITIAL_GEOFENCES);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Map Provider & Settings
  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>('google');
  const [googleMapType, setGoogleMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [showTrafficLayer, setShowTrafficLayer] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Modals
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isAddDeliveryOpen, setIsAddDeliveryOpen] = useState(false);
  const [isScheduleMaintenanceOpen, setIsScheduleMaintenanceOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(false);
  const [authToast, setAuthToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Synchronize Firebase Auth with Firestore users collection on mount
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsFirebaseLoading(true);
        try {
          const profile = await fetchUserProfile(fbUser.uid);
          if (profile) {
            // Previously logged in user: restore saved role and properties!
            setCurrentUser({
              id: profile.id,
              name: profile.name || fbUser.displayName || 'Authorized User',
              email: profile.email || fbUser.email || '',
              role: profile.role || 'Owner',
              company: profile.company || 'Singhania Heavy Logistics Corp',
              avatar: profile.avatar || fbUser.photoURL || undefined,
              phone: profile.phone,
              assignedVehicleId: profile.assignedVehicleId,
              assignedVehicleReg: profile.assignedVehicleReg,
              driverLicense: profile.driverLicense,
              dutyStatus: profile.dutyStatus || 'driving',
              isGoogleLinked: true
            });
            setAuthToast({
              message: `Auto-connected via Google: Welcome back ${profile.name} (${profile.role})`,
              type: 'success'
            });
          }
        } catch (err) {
          console.warn('Error fetching Firestore user:', err);
        } finally {
          setIsFirebaseLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch initial data
  const refreshAllData = useCallback(async () => {
    try {
      const [
        statsData,
        vehiclesData,
        driversData,
        routesData,
        deliveriesData,
        maintenanceData,
        predictionsData,
        fuelData,
        fuelAnaData,
        alertsData
      ] = await Promise.all([
        api.getStats(),
        api.getVehicles(),
        api.getDrivers(),
        api.getRoutes(),
        api.getDeliveries(),
        api.getMaintenance(),
        api.getPredictions(),
        api.getFuelRecords(),
        api.getFuelAnalytics(),
        api.getAlerts()
      ]);

      if (statsData) setStats(statsData as any);
      if (vehiclesData) setVehicles(vehiclesData);
      if (driversData) setDrivers(driversData);
      if (routesData) setRoutes(routesData);
      if (deliveriesData) setDeliveries(deliveriesData);
      if (maintenanceData) setMaintenance(maintenanceData);
      if (predictionsData) setPredictions(predictionsData);
      if (fuelData) setFuelRecords(fuelData);
      if (fuelAnaData) setFuelAnalytics(fuelAnaData);
      if (alertsData) setAlerts(alertsData);
    } catch (err) {
      console.warn('Using seeded data as fallback:', err);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Connect to SSE for live vehicle movements & fallback interval
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let localInterval: any = null;

    if (isDemoMode) {
      try {
        eventSource = new EventSource('/api/events');
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'TELEMETRY_UPDATE' && Array.isArray(data.vehicles)) {
              setVehicles((prev) => {
                const map = new Map<string, any>(data.vehicles.map((v: any) => [v.id, v]));
                return prev.map((v) => {
                  const update = map.get(v.id);
                  if (!update) return v;
                  return {
                    ...v,
                    speed: update.speed,
                    fuelLevel: update.fuelLevel,
                    engineTemp: update.engineTemp,
                    heading: update.heading,
                    etaMinutes: update.etaMinutes,
                    currentLocation: {
                      ...v.currentLocation,
                      lat: update.lat,
                      lng: update.lng
                    }
                  };
                });
              });
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        };

        eventSource.onerror = () => {
          if (!localInterval) {
            localInterval = setInterval(() => {
              setVehicles((prev) => simulateVehicleTelemetryStep(prev));
            }, 3000 / simulationSpeed);
          }
        };
      } catch {
        localInterval = setInterval(() => {
          setVehicles((prev) => simulateVehicleTelemetryStep(prev));
        }, 3000 / simulationSpeed);
      }
    }

    return () => {
      if (eventSource) eventSource.close();
      if (localInterval) clearInterval(localInterval);
    };
  }, [isDemoMode, simulationSpeed]);

  const setUserRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
      if (role === 'Driver') {
        setActiveView('driver-portal');
      }
    }
  };

  const loginWithGoogle = async (preferredRole: 'Owner' | 'Driver' = 'Owner', targetView: ActiveView = 'reference') => {
    setIsFirebaseLoading(true);
    try {
      const { firebaseUser, existingProfile } = await signInWithGooglePopup();
      if (existingProfile) {
        // Previously logged in user: restore role & saved profile from database!
        const restored: User = {
          id: existingProfile.id,
          name: existingProfile.name || firebaseUser.displayName || 'Authorized User',
          email: existingProfile.email || firebaseUser.email || '',
          role: existingProfile.role,
          company: existingProfile.company || 'Singhania Heavy Logistics Corp',
          avatar: existingProfile.avatar || firebaseUser.photoURL || undefined,
          phone: existingProfile.phone,
          assignedVehicleId: existingProfile.assignedVehicleId,
          assignedVehicleReg: existingProfile.assignedVehicleReg,
          driverLicense: existingProfile.driverLicense,
          dutyStatus: existingProfile.dutyStatus || 'driving',
          isGoogleLinked: true
        };
        setCurrentUser(restored);
        setAuthToast({
          message: `Connected with Google! Restored account for ${restored.name} as ${restored.role}.`,
          type: 'success'
        });
        setActiveView(targetView);
      } else {
        // First-time Google user: save new profile to Firestore users collection
        const newRecord: FirestoreUserData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || (preferredRole === 'Owner' ? 'Rajesh Singhania' : 'Arun Kumar'),
          email: firebaseUser.email || '',
          role: preferredRole,
          company: 'Singhania Heavy Logistics Corp',
          avatar: firebaseUser.photoURL || undefined,
          assignedVehicleId: preferredRole === 'Driver' ? 'veh-1' : undefined,
          assignedVehicleReg: preferredRole === 'Driver' ? 'TN 01 AB 1234' : undefined,
          driverLicense: preferredRole === 'Driver' ? 'TN-01-2018-0091823' : undefined,
          dutyStatus: preferredRole === 'Driver' ? 'driving' : undefined,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        await saveUserProfile(newRecord);
        setCurrentUser({
          id: newRecord.id,
          name: newRecord.name,
          email: newRecord.email,
          role: newRecord.role,
          company: newRecord.company || '',
          avatar: newRecord.avatar,
          assignedVehicleId: newRecord.assignedVehicleId,
          assignedVehicleReg: newRecord.assignedVehicleReg,
          driverLicense: newRecord.driverLicense,
          dutyStatus: newRecord.dutyStatus,
          isGoogleLinked: true
        });
        setAuthToast({
          message: `Connected with Google! Created ${preferredRole} profile in Firestore database.`,
          type: 'success'
        });
        setActiveView(targetView);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setAuthToast({
        message: err.message || 'Google sign-in was cancelled or encountered an error.',
        type: 'error'
      });
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const loginAsOwner = async (credentials?: { email?: string; name?: string; company?: string }, targetView: ActiveView = 'reference') => {
    const ownerUser: User = {
      id: currentUser?.id && currentUser.isGoogleLinked ? currentUser.id : 'usr-owner-1',
      name: credentials?.name || 'Rajesh Singhania',
      email: credentials?.email || 'owner@fleetx.io',
      role: 'Owner',
      company: credentials?.company || 'Singhania Heavy Logistics Corp',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98400 11223',
      isGoogleLinked: currentUser?.isGoogleLinked
    };
    setCurrentUser(ownerUser);
    setActiveView(targetView);
    setAuthToast({
      message: `Signed in as Fleet Owner (${ownerUser.name}). Complete operations access enabled.`,
      type: 'success'
    });
    // Persist to database if authenticated
    if (auth.currentUser) {
      saveUserProfile({
        id: auth.currentUser.uid,
        name: ownerUser.name,
        email: ownerUser.email,
        role: 'Owner',
        company: ownerUser.company,
        avatar: ownerUser.avatar,
        phone: ownerUser.phone,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }).catch(() => {});
    }
  };

  const loginAsDriver = async (credentials?: { email?: string; name?: string; vehicleId?: string; licenseNumber?: string }, targetView: ActiveView = 'reference') => {
    const assignedVeh = vehicles.find((v) => v.id === credentials?.vehicleId) || vehicles[0];
    const driverUser: User = {
      id: currentUser?.id && currentUser.isGoogleLinked ? currentUser.id : 'usr-driver-1',
      name: credentials?.name || 'Arun Kumar',
      email: credentials?.email || 'arun.k@fleetx.io',
      role: 'Driver',
      company: 'Singhania Heavy Logistics Corp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      assignedVehicleId: assignedVeh?.id || 'veh-1',
      assignedVehicleReg: assignedVeh?.registrationNumber || 'TN 01 AB 1234',
      driverLicense: credentials?.licenseNumber || 'TN-01-2018-0091823',
      dutyStatus: 'driving',
      phone: '+91 98401 22891',
      isGoogleLinked: currentUser?.isGoogleLinked
    };
    setCurrentUser(driverUser);
    setActiveView(targetView);
    setAuthToast({
      message: `Signed in as Fleet Driver (${driverUser.name}). Assigned vehicle: ${driverUser.assignedVehicleReg}`,
      type: 'success'
    });
    // Persist to database if authenticated
    if (auth.currentUser) {
      saveUserProfile({
        id: auth.currentUser.uid,
        name: driverUser.name,
        email: driverUser.email,
        role: 'Driver',
        company: driverUser.company,
        avatar: driverUser.avatar,
        phone: driverUser.phone,
        assignedVehicleId: driverUser.assignedVehicleId,
        assignedVehicleReg: driverUser.assignedVehicleReg,
        driverLicense: driverUser.driverLicense,
        dutyStatus: driverUser.dutyStatus,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }).catch(() => {});
    }
  };

  const logoutUser = async () => {
    try {
      await logOutFirebase();
    } catch {}
    setCurrentUser(null);
    setActiveView('login');
    setAuthToast({
      message: 'Signed out of FleetX. Please choose Owner or Driver portal to continue.',
      type: 'info'
    });
  };

  const updateDriverDutyStatus = async (status: 'available' | 'driving' | 'break' | 'offline') => {
    if (currentUser) {
      const updatedUser = { ...currentUser, dutyStatus: status };
      setCurrentUser(updatedUser);
      // Update in drivers list
      setDrivers((prev) =>
        prev.map((d) => (d.name === currentUser.name || d.id === currentUser.id ? { ...d, status } : d))
      );
      // Update vehicle status
      if (currentUser.assignedVehicleId) {
        setVehicles((prev) =>
          prev.map((v) => {
            if (v.id === currentUser.assignedVehicleId) {
              return {
                ...v,
                status: status === 'driving' ? 'in_transit' : status === 'available' ? 'active' : status === 'offline' ? 'offline' : v.status
              };
            }
            return v;
          })
        );
      }
      // Sync to Firestore if authenticated
      if (auth.currentUser) {
        saveUserProfile({
          id: auth.currentUser.uid,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          company: updatedUser.company,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
          assignedVehicleId: updatedUser.assignedVehicleId,
          assignedVehicleReg: updatedUser.assignedVehicleReg,
          driverLicense: updatedUser.driverLicense,
          dutyStatus: status,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }).catch(() => {});
      }
    }
  };

  const addVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      const created = await api.createVehicle(vehicleData);
      setVehicles((prev) => [created, ...prev]);
    } catch {
      const fallback: Vehicle = {
        id: `veh-${Date.now()}`,
        vehicleId: `VX-${vehicles.length + 101}`,
        registrationNumber: vehicleData.registrationNumber || 'TN 01 ZZ 9999',
        type: vehicleData.type || 'Truck',
        model: vehicleData.model || 'Heavy Hauler',
        year: vehicleData.year || 2024,
        status: vehicleData.status || 'active',
        fuelLevel: vehicleData.fuelLevel || 100,
        mileage: vehicleData.mileage || 1000,
        healthScore: 96,
        speed: 0,
        engineTemp: 85,
        batteryVoltage: 24.2,
        tirePressure: 110,
        currentLocation: { lat: 13.0827, lng: 80.2707, address: 'Central Hub' },
        heading: 0,
        nextServiceDate: '2026-12-31',
        fuelConsumptionRate: 25.0,
        maintenanceRisk: 15,
        predictedIssue: 'Optimal'
      };
      setVehicles((prev) => [fallback, ...prev]);
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    try {
      await api.updateVehicle(id, vehicleData);
    } catch {}
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...vehicleData } : v)));
  };

  const deleteVehicle = async (id: string) => {
    try {
      await api.deleteVehicle(id);
    } catch {}
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const addDriver = async (driverData: Partial<Driver>) => {
    try {
      const created = await api.createDriver(driverData);
      setDrivers((prev) => [created, ...prev]);
    } catch {
      const fallback: Driver = {
        id: `drv-${Date.now()}`,
        name: driverData.name || 'New Driver',
        email: driverData.email || 'driver@fleetx.io',
        phone: driverData.phone || '+91 99999 00000',
        licenseNumber: driverData.licenseNumber || 'TN-01-2024-001',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(driverData.name || 'Driver')}`,
        status: driverData.status || 'available',
        safetyScore: 92,
        speedingEvents: 0,
        harshBrakingEvents: 0,
        accelerationEvents: 0,
        idlingMinutes: 5,
        routeAdherenceScore: 98,
        tripsCompleted: 0,
        rating: 5.0,
        experienceYears: driverData.experienceYears || 3,
        hosDrivingMinutesToday: 180,
        hosMaxDrivingMinutes: 480,
        hosNextBreakDueMinutes: 90
      };
      setDrivers((prev) => [fallback, ...prev]);
    }
  };

  const addDelivery = async (deliveryData: Partial<Delivery>) => {
    try {
      const created = await api.createDelivery(deliveryData);
      setDeliveries((prev) => [created, ...prev]);
    } catch {
      const fallback: Delivery = {
        id: `del-${Date.now()}`,
        deliveryId: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: deliveryData.customer || 'New Customer',
        pickup: deliveryData.pickup || 'Port Depot',
        destination: deliveryData.destination || 'Destination Hub',
        assignedVehicleId: deliveryData.assignedVehicleId || vehicles[0]?.id || 'veh-1',
        vehicleReg: deliveryData.vehicleReg || vehicles[0]?.registrationNumber || 'TN 01 AB 1234',
        driverId: deliveryData.driverId || drivers[0]?.id || 'drv-1',
        driverName: deliveryData.driverName || drivers[0]?.name || 'Arun Kumar',
        expectedDelivery: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
        status: 'assigned',
        itemsCount: deliveryData.itemsCount || 20,
        totalWeightKg: deliveryData.totalWeightKg || 1200,
        priority: deliveryData.priority || 'normal',
        timeline: [
          { status: 'pending', label: 'Order Created', timestamp: 'Just now', completed: true },
          { status: 'assigned', label: 'Vehicle Assigned', timestamp: 'Just now', completed: true },
          { status: 'in_transit', label: 'Picked Up & En Route', timestamp: 'Pending', completed: false },
          { status: 'delivered', label: 'Delivered', timestamp: 'Pending', completed: false }
        ]
      };
      setDeliveries((prev) => [fallback, ...prev]);
    }
  };

  const updateDeliveryStatus = async (id: string, status: any) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const updatedTimeline = d.timeline.map((t) => {
          if (t.status === status) return { ...t, completed: true, timestamp: 'Just now' };
          return t;
        });
        return { ...d, status, timeline: updatedTimeline };
      })
    );
    try {
      await api.updateDelivery(id, { status });
    } catch {}
  };

  const addMaintenance = async (maintenanceData: Partial<MaintenanceRecord>) => {
    try {
      const created = await api.createMaintenance(maintenanceData);
      setMaintenance((prev) => [created, ...prev]);
    } catch {
      const fallback: MaintenanceRecord = {
        id: `mnt-${Date.now()}`,
        vehicleId: maintenanceData.vehicleId || vehicles[0]?.id || 'veh-1',
        vehicleReg: maintenanceData.vehicleReg || vehicles[0]?.registrationNumber || 'TN 01 AB 1234',
        serviceType: maintenanceData.serviceType || 'Inspection & Fluid Service',
        description: maintenanceData.description || 'Preventative service scheduled',
        date: new Date().toISOString().split('T')[0],
        mileage: maintenanceData.mileage || 50000,
        cost: maintenanceData.cost || 12000,
        technician: maintenanceData.technician || 'Chief Service Engineer',
        status: 'Scheduled',
        nextServiceDate: '2026-12-15'
      };
      setMaintenance((prev) => [fallback, ...prev]);
    }
  };

  const optimizeRoute = async (routeId: string) => {
    const res = await api.optimizeRoute(routeId);
    setRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, optimized: true, distanceKm: res.newDistanceKm || r.distanceKm * 0.9 } : r))
    );
    return res;
  };

  const markAlertRead = async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
    try {
      await api.markAlertRead(id);
    } catch {}
  };

  // Remote Fleet Commands (Speed limiter, Engine kill switch, Central lock)
  const sendRemoteCommand = async (vehicleId: string, command: 'immobilize' | 'speed_limit' | 'lock' | 'unlock' | 'horn', value?: any) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== vehicleId) return v;
        if (command === 'immobilize') {
          const nextState = !v.isEngineImmobilized;
          return {
            ...v,
            isEngineImmobilized: nextState,
            status: nextState ? 'offline' : 'active',
            speed: nextState ? 0 : v.speed
          };
        }
        if (command === 'speed_limit') {
          return { ...v, speedGovernorLimit: value || 60, speed: Math.min(v.speed, value || 60) };
        }
        if (command === 'lock') {
          return { ...v, isDoorLocked: true };
        }
        if (command === 'unlock') {
          return { ...v, isDoorLocked: false };
        }
        return v;
      })
    );

    // Create confirmation alert
    const targetVeh = vehicles.find((v) => v.id === vehicleId);
    const newAlert: Alert = {
      id: `alt-${Date.now()}`,
      type: 'remote_command',
      severity: 'info',
      vehicleReg: targetVeh?.registrationNumber,
      message: `OTA COMMAND EXECUTED: ${command.toUpperCase()} signal acknowledged by ${targetVeh?.registrationNumber}`,
      timestamp: 'Just now',
      isRead: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Run CAN-Bus / OBD-II Diagnostic Scan
  const runDiagnosticScan = async (vehicleId: string) => {
    const v = vehicles.find((veh) => veh.id === vehicleId);
    const sampleCodes = [
      { code: 'P0128', system: 'Cooling System', description: 'Coolant Temp Below Thermostat Regulating Temp', severity: 'minor' as const, timestamp: 'Today' },
      { code: 'P0420', system: 'Exhaust Catalyst', description: 'Catalyst System Efficiency Below Threshold', severity: 'moderate' as const, timestamp: 'Today' },
    ];
    setVehicles((prev) =>
      prev.map((veh) => (veh.id === vehicleId ? { ...veh, diagnosticCodes: sampleCodes } : veh))
    );
    return { success: true, vehicleId, codes: sampleCodes, scannedAt: new Date().toISOString() };
  };

  // Export CSV Audit Report
  const exportAuditReport = () => {
    const headers = 'Vehicle ID,Registration,Type,Model,Status,Speed (km/h),Fuel Level (%),Mileage (km),Health Score,Driver,Destination\n';
    const rows = vehicles
      .map(
        (v) =>
          `"${v.vehicleId}","${v.registrationNumber}","${v.type}","${v.model}","${v.status}",${v.speed},${v.fuelLevel},${v.mileage},${v.healthScore},"${v.driverName || 'Unassigned'}","${v.destination || 'Depot'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fleetx-telematics-audit-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <FleetContext.Provider
      value={{
        activeView,
        setActiveView,
        currentUser,
        setCurrentUser,
        setUserRole,
        isFirebaseLoading,
        authToast,
        setAuthToast,
        loginWithGoogle,
        loginAsOwner,
        loginAsDriver,
        logoutUser,
        updateDriverDutyStatus,
        stats,
        vehicles,
        drivers,
        routes,
        deliveries,
        maintenance,
        predictions,
        fuelRecords,
        fuelAnalytics,
        alerts,
        unreadAlertsCount,
        isDemoMode,
        setIsDemoMode,
        selectedVehicle,
        setSelectedVehicle,
        selectedDriver,
        setSelectedDriver,
        globalSearch,
        setGlobalSearch,
        sidebarCollapsed,
        setSidebarCollapsed,
        mapProvider,
        setMapProvider,
        googleMapType,
        setGoogleMapType,
        showTrafficLayer,
        setShowTrafficLayer,
        geofences,
        simulationSpeed,
        setSimulationSpeed,
        isAddVehicleOpen,
        setIsAddVehicleOpen,
        isAddDriverOpen,
        setIsAddDriverOpen,
        isAddDeliveryOpen,
        setIsAddDeliveryOpen,
        isScheduleMaintenanceOpen,
        setIsScheduleMaintenanceOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addDriver,
        addDelivery,
        updateDeliveryStatus,
        addMaintenance,
        optimizeRoute,
        markAlertRead,
        refreshAllData,
        sendRemoteCommand,
        runDiagnosticScan,
        exportAuditReport
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
