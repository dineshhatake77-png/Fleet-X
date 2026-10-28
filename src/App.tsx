import React, { useState, useEffect } from 'react';
import { FleetProvider, useFleet } from './context/FleetContext';
import { ReferenceHeroView } from './components/layout/ReferenceHeroView';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { LiveTrackingView } from './components/tracking/LiveTrackingView';
import { VehiclesView } from './components/vehicles/VehiclesView';
import { DriversView } from './components/drivers/DriversView';
import { RoutesView } from './components/routes/RoutesView';
import { DeliveriesView } from './components/deliveries/DeliveriesView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { FuelView } from './components/fuel/FuelView';
import { AlertsView } from './components/alerts/AlertsView';
import { ReportsView } from './components/reports/ReportsView';
import { AuthModal } from './components/auth/AuthModal';
import { IndividualLoginGate } from './components/auth/IndividualLoginGate';
import { QuickActionModals } from './components/modals/QuickActionModals';
import { DriverCockpitView } from './components/driver/DriverCockpitView';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const FleetAppContent: React.FC = () => {
  const { activeView, authToast, setAuthToast, currentUser } = useFleet();
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Show Individual Login First on project opening
  if (activeView === 'login') {
    return (
      <div className="relative min-h-screen w-full bg-[#0a0d14]">
        <IndividualLoginGate />
        {/* Floating Auth & Database Toast */}
        {authToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-neutral-900 text-white p-4 rounded-2xl shadow-2xl border border-neutral-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
            {authToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {authToast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
            {authToast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs leading-relaxed">
              {authToast.message}
            </div>
            <button
              onClick={() => setAuthToast(null)}
              className="text-neutral-400 hover:text-white p-0.5 rounded-lg hover:bg-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // If in reference design view (Landing Page), show exact replica of user's reference image
  if (activeView === 'reference') {
    return (
      <>
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}
        <ReferenceHeroView />
        <AuthModal />
      </>
    );
  }

  // Operational Suite layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#eef1f6] text-neutral-900 font-sans flex-col">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <TopNav />

          <main className="flex-1 overflow-y-auto bg-[#eef1f6]">
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'tracking' && <LiveTrackingView />}
            {activeView === 'vehicles' && <VehiclesView />}
            {activeView === 'drivers' && <DriversView />}
            {activeView === 'routes' && <RoutesView />}
            {activeView === 'deliveries' && <DeliveriesView />}
            {activeView === 'maintenance' && <MaintenanceView />}
            {activeView === 'fuel' && <FuelView />}
            {activeView === 'alerts' && <AlertsView />}
            {activeView === 'reports' && <ReportsView />}
            {activeView === 'driver-portal' && <DriverCockpitView />}
          </main>
        </div>
      </div>

      {/* Floating Auth & Database Toast */}
      {authToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-neutral-900 text-white p-4 rounded-2xl shadow-2xl border border-neutral-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
          {authToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
          {authToast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
          {authToast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />}
          <div className="flex-1 text-xs leading-relaxed">
            {authToast.message}
          </div>
          <button
            onClick={() => setAuthToast(null)}
            className="text-neutral-400 hover:text-white p-0.5 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <AuthModal />
      <QuickActionModals />
    </div>
  );
};

export default function App() {
  return (
    <FleetProvider>
      <FleetAppContent />
    </FleetProvider>
  );
}
