import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy, memo } from 'react';
import { DashboardLayout } from './components/common/layouts';
import { SubNav } from './components/navigation/SubNav';
import { ConnectionGrid } from './components/ConnectionGrid';
import { ToastContainer } from './components/common/ToastContainer';
import { ConnectionTabs } from './components/connection/ConnectionTabs';
import { useStore } from './store/useStore';
import { ThemeProvider } from './components/ThemeProvider';
import { MobileMenu } from './components/navigation/MobileMenu';
// SmartAssistant removed per user request
import { FeedbackWidget } from './components/feedback/FeedbackWidget';
import { NavigationStateProvider } from './components/common/layouts/NavigationStateProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { GroupGrid } from './components/GroupGrid';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AsyncBoundary } from './components/common/AsyncBoundary';
import { ProductTour } from './components/tour/ProductTour';
import { useTour } from './hooks/useTour';
import { mainAppTour } from './data/tourSteps';
import { MobileManagePage } from './components/MobileManagePage';
import { useIsMobile } from './hooks/useMobileDetection';
import { MobileConfigureHub } from './components/configure/MobileConfigureHub';
import { MobileDesktopOnly } from './components/common/MobileDesktopOnly';
import { GlobalKeyboardShortcuts } from './components/common/GlobalKeyboardShortcuts';
import { ImpersonationBanner } from './components/common/ImpersonationBanner';
import { PWAUpdatePrompt, usePWAUpdate } from './components/common/PWAUpdatePrompt';
import { MaintenanceModal } from './components/common/MaintenanceModal';
import { DemoRoleSwitcher } from './components/common/DemoRoleSwitcher';

// Optimized lazy loading with better error handling
const LazyConnectionWizard = lazy(() =>
  import('./components/wizard/ConnectionWizard').then(module => ({
    default: module.ConnectionWizard
  }))
);

const LazyAPIToolbox = lazy(() =>
  import('./components/api-toolbox/APIToolbox').then(module => ({
    default: module.APIToolbox
  }))
);

const LazyAWSWorkflowPage = lazy(() =>
  import('./components/pages/AWSWorkflowPage')
);
const LazyConnectionDetails = lazy(() =>
  import('./components/connection/ConnectionDetails').then(module => ({ 
    default: module.ConnectionDetails 
  }))
);

const LazyMonitoringDashboard = lazy(() => 
  import('./components/monitoring/monitoring/MonitoringDashboard').then(module => ({ 
    default: module.default 
  }))
);

const LazyMobileMonitoringDashboard = lazy(() => 
  import('./components/monitoring/MobileMonitoringDashboard').then(module => ({ 
    default: module.MobileMonitoringDashboard 
  }))
);

const LazyConfigureHub = lazy(() => 
  import('./components/configure/ConfigureHub').then(module => ({ 
    default: module.ConfigureHub 
  }))
);

const LazyUserProfile = lazy(() => 
  import('./components/profile/UserProfile').then(module => ({ 
    default: module.UserProfile 
  }))
);

const LazyNotificationsPage = lazy(() => 
  import('./components/pages/NotificationsPage').then(module => ({ 
    default: module.NotificationsPage 
  }))
);

const LazyHelpResourcesPage = lazy(() =>
  import('./components/pages/HelpResourcesPage').then(module => ({
    default: module.HelpResourcesPage
  }))
);

const LazyGlossaryPage = lazy(() =>
  import('./components/pages/GlossaryPage').then(module => ({
    default: module.GlossaryPage
  }))
);

const LazyManageGroupsPage = lazy(() => 
  import('./components/ManageGroupsPage').then(module => ({ 
    default: module.ManageGroupsPage 
  }))
);

const LazyGroupDetailsPage = lazy(() =>
  import('./components/GroupDetailsPage').then(module => ({
    default: module.GroupDetailsPage
  }))
);

const LazyPoolDetailPage = lazy(() =>
  import('./components/pages/PoolDetailPage').then(module => ({
    default: module.PoolDetailPage
  }))
);

const LazyCloudRouterDetailPage = lazy(() =>
  import('./components/pages/CloudRouterDetailPage').then(module => ({
    default: module.CloudRouterDetailPage
  }))
);

const LazyVNFDetailPage = lazy(() =>
  import('./components/pages/VNFDetailPage').then(module => ({
    default: module.VNFDetailPage
  }))
);

// Only load these when actually needed
const LazyControlCenterManager = lazy(() =>
  import('./components/control-center/ControlCenterManager').then(module => ({
    default: module.ControlCenterManager
  }))
);

const LazyMarketplace = lazy(() =>
  import('./components/Marketplace').then(module => ({
    default: module.Marketplace
  }))
);

const LazyDetachedVNFTable = lazy(() =>
  import('./components/connection/vnf/DetachedVNFTable').then(module => ({
    default: module.DetachedVNFTable
  }))
);

const LazyPlatformAdminPage = lazy(() =>
  import('./components/platform-admin/PlatformAdminPage').then(module => ({
    default: module.PlatformAdminPage
  }))
);

const LazyTenantDetailPage = lazy(() =>
  import('./components/platform-admin/TenantDetailPage').then(module => ({
    default: module.TenantDetailPage
  }))
);

const LazyTicketingIndex = lazy(() =>
  import('./components/ticketing/TicketingIndex').then(module => ({
    default: module.TicketingIndex
  }))
);

const LazyCMSBannerEditor = lazy(() =>
  import('./components/support/CMSBannerEditor').then(module => ({
    default: module.CMSBannerEditor
  }))
);

const LazyCreateTicket = lazy(() =>
  import('./components/ticketing/CreateTicket').then(module => ({
    default: module.CreateTicket
  }))
);

const LazyTicketDetail = lazy(() =>
  import('./components/ticketing/TicketDetail').then(module => ({
    default: module.TicketDetail
  }))
);

const LazyLoginPage = lazy(() =>
  import('./components/pages/LoginPage').then(module => ({
    default: module.LoginPage
  }))
);

const LazyOnboardingWizard = lazy(() =>
  import('./components/onboarding/OnboardingWizard').then(module => ({
    default: module.OnboardingWizard
  }))
);

const LazyOffboardingWizard = lazy(() =>
  import('./components/offboarding/OffboardingWizard').then(module => ({
    default: module.OffboardingWizard
  }))
);

const LazyNoInternetPage = lazy(() =>
  import('./components/pages/NoInternetPage').then(module => ({
    default: module.NoInternetPage
  }))
);

const LazyMaintenancePage = lazy(() =>
  import('./components/pages/MaintenancePage').then(module => ({
    default: module.MaintenancePage
  }))
);

const LazyNewsPage = lazy(() =>
  import('./components/pages/NewsPage').then(module => ({
    default: module.NewsPage
  }))
);

// Optimized loading fallback
const LoadingFallback = memo(() => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoadingSpinner size="lg" color="brand" />
  </div>
));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const connections = useStore(state => state.connections);
  const groups = useStore(state => state.groups);
  const [activeTab, setActiveTab] = useState<'connections' | 'marketplace' | 'groups' | 'control-center'>('connections');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const tour = useTour('main-app');
  const pwaUpdate = usePWAUpdate();
  const [showMaintenance, setShowMaintenance] = useState(false);

  const maintenanceSchedule = {
    date: 'March 25, 2026',
    startTime: '2026-03-25T02:00:00',
    endTime: '2026-03-25T06:00:00',
    duration: '4 hours',
    description: 'We will be performing scheduled maintenance to upgrade our network infrastructure. During this time, the management portal will be temporarily unavailable.',
    affectedServices: ['Management Portal', 'API Gateway', 'Monitoring Dashboard'],
  };

  // Check if current route is a detached window or standalone page
  const isDetachedWindow = location.pathname.startsWith('/detached/');
  const isStandalonePage = location.pathname === '/login' || location.pathname === '/onboarding' || location.pathname === '/offboarding' || location.pathname === '/no-internet' || location.pathname === '/maintenance';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const initApp = () => setTimeout(() => {
      setIsInitializing(false);
      if (!tour.hasCompleted && !isMobile) {
        setTimeout(() => tour.startTour(), 1000);
      }
    }, 300);

    checkMobile();
    initApp();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const userInfo = {
    name: 'Emilio',
    role: 'Admin',
    account: 'AT&T',
    email: 'emilio.estevez@att.com',
    avatar: null
  };

  if (isInitializing) {
    return <LoadingFallback />;
  }

  // Safe array handling
  const safeConnections = Array.isArray(connections) ? connections : [];
  const safeGroups = Array.isArray(groups) ? groups : [];

  return (
    <NavigationStateProvider>
      <ThemeProvider>
        <ErrorBoundary onReset={() => window.location.reload()}>
          <ImpersonationBanner />
          <ToastContainer />
          <GlobalKeyboardShortcuts />
          {pwaUpdate.showPrompt && (
            <PWAUpdatePrompt
              onUpdate={pwaUpdate.handleUpdate}
              onDismiss={pwaUpdate.handleDismiss}
            />
          )}
          <Routes>
            {/* Detached windows - no layout wrapper */}
            <Route path="/detached/vnf/:connectionId/:windowId" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyDetachedVNFTable />
              </Suspense>
            } />

            {/* Login - standalone, no layout */}
            <Route path="/login" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyLoginPage />
              </Suspense>
            } />

            {/* Onboarding - standalone, no layout */}
            <Route path="/onboarding" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyOnboardingWizard />
              </Suspense>
            } />

            {/* Offboarding - standalone, no layout */}
            <Route path="/offboarding" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyOffboardingWizard />
              </Suspense>
            } />

            {/* No Internet - standalone, no layout */}
            <Route path="/no-internet" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyNoInternetPage />
              </Suspense>
            } />

            {/* Maintenance - standalone, no layout */}
            <Route path="/maintenance" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyMaintenancePage />
              </Suspense>
            } />

            {/* Main app routes - with layout wrapper */}
            <Route path="*" element={
              <DashboardLayout>
                <main id="main-content" tabIndex={-1} className="min-h-screen">
                  <Routes>
                <Route path="/create" element={
                  isMobile ? (
                    <MobileDesktopOnly
                      feature="Create Connection"
                      description="Creating connections requires multiple complex configuration steps that work best on a desktop or laptop screen."
                      alternativeAction={{
                        label: "View Connections",
                        path: "/manage"
                      }}
                    />
                  ) : (
                    <AsyncBoundary fallback={<LoadingFallback />}>
                      <SubNav
                        title="Create Connection"
                        description="Set up a new network connection"
                      >
                        <Suspense fallback={<LoadingFallback />}>
                          <LazyConnectionWizard
                            onComplete={(config) => {
                              try {
                                const connectionName = typeof config === 'object' && config !== null
                                  ? (config as any).name || 'New Connection'
                                  : 'New Connection';

                                window.addToast?.({
                                  type: 'success',
                                  title: 'Connection Created',
                                  message: `Connection "${connectionName}" created successfully`,
                                  duration: 3000
                                });
                                navigate('/manage');
                              } catch (error) {
                                console.error('Error handling connection completion:', error);
                                navigate('/manage');
                              }
                            }}
                            onCancel={() => navigate('/manage')}
                          />
                        </Suspense>
                      </SubNav>
                    </AsyncBoundary>
                  )
                } />

                <Route path="/api-toolbox" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyAPIToolbox />
                      </Suspense>
                    </div>
                  </AsyncBoundary>
                } />
                
                <Route path="/manage" element={
                  isMobile ? (
                    <MobileManagePage
                      connections={safeConnections}
                      groups={safeGroups}
                      activeTab={activeTab}
                      onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
                    />
                  ) : (
                    <SubNav
                      title="Networks"
                      description="Manage your network connections across clouds and data centers"
                    >
                      <div className="mb-8">
                        <ConnectionTabs
                          activeTab={activeTab}
                          onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
                          connectionCount={safeConnections.length}
                          groupCount={safeGroups.length}
                        />
                      </div>
                      {activeTab === 'connections' ? (
                        <ConnectionGrid connections={safeConnections} />
                      ) : activeTab === 'groups' ? (
                        <GroupGrid groups={safeGroups} />
                      ) : activeTab === 'control-center' ? (
                        <AsyncBoundary fallback={<LoadingFallback />}>
                          <Suspense fallback={<LoadingFallback />}>
                            <LazyControlCenterManager connections={safeConnections} />
                          </Suspense>
                        </AsyncBoundary>
                      ) : (
                        <AsyncBoundary fallback={<LoadingFallback />}>
                          <Suspense fallback={<LoadingFallback />}>
                            <LazyMarketplace onSelectItem={() => {}} />
                          </Suspense>
                        </AsyncBoundary>
                      )}
                    </SubNav>
                  )
                } />

                <Route path="/monitor" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    {isMobile ? (
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyMobileMonitoringDashboard connections={safeConnections} />
                      </Suspense>
                    ) : (
                      <SubNav
                        title="Performance"
                        description="Near real-time monitoring and analytics for your network connections"
                      >
                        <Suspense fallback={<LoadingFallback />}>
                          <LazyMonitoringDashboard connections={safeConnections} />
                        </Suspense>
                      </SubNav>
                    )}
                  </AsyncBoundary>
                } />

                <Route path="/configure/*" element={
                  isMobile ? (
                    <MobileConfigureHub />
                  ) : (
                    <AsyncBoundary fallback={<LoadingFallback />}>
                      <SubNav
                        title="System Configuration"
                        description="Configure system settings and preferences"
                      >
                        <Suspense fallback={<LoadingFallback />}>
                          <LazyConfigureHub defaultTab="connections" />
                        </Suspense>
                      </SubNav>
                    </AsyncBoundary>
                  )
                } />

                <Route path="/profile" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="User Profile"
                      description="Manage your profile and preferences"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyUserProfile />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/notifications" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyNotificationsPage />
                      </Suspense>
                    </div>
                  </AsyncBoundary>
                } />

                <Route path="/support" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="Information Center"
                      description="Access documentation, support, and resources"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyHelpResourcesPage />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/support/banners" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="Banner Management"
                      description="Manage promotional and informational banners"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyCMSBannerEditor />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/glossary" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyGlossaryPage />
                      </Suspense>
                    </div>
                  </AsyncBoundary>
                } />

                <Route path="/news" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="News & Announcements"
                      description="Platform updates, maintenance windows, and service announcements"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyNewsPage />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/tickets" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="Ticketing"
                      description="Manage support tickets and service requests"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyTicketingIndex />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/tickets/create" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="Create a new ticket"
                      description="Submit a new support request"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyCreateTicket />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/tickets/:id" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="Ticket Detail"
                      description="View ticket information and activity"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyTicketDetail />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/aws-workflow" element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    <Suspense fallback={<LoadingFallback />}>
                      <LazyAWSWorkflowPage />
                    </Suspense>
                  </div>
                } />

                <Route path="/connections/:id/*" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyConnectionDetails />
                      </Suspense>
                    </div>
                  </AsyncBoundary>
                } />

                <Route path="/groups" element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    <Suspense fallback={<LoadingFallback />}>
                      <LazyManageGroupsPage />
                    </Suspense>
                  </div>
                } />

                <Route path="/groups/:id/*" element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    <Suspense fallback={<LoadingFallback />}>
                      <LazyGroupDetailsPage />
                    </Suspense>
                  </div>
                } />

                <Route path="/pools/:id" element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    <Suspense fallback={<LoadingFallback />}>
                      <LazyPoolDetailPage />
                    </Suspense>
                  </div>
                } />

                <Route path="/cloud-routers/:id" element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    <Suspense fallback={<LoadingFallback />}>
                      <LazyCloudRouterDetailPage />
                    </Suspense>
                  </div>
                } />

                <Route path="/vnfs/:id" element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
                    <Suspense fallback={<LoadingFallback />}>
                      <LazyVNFDetailPage />
                    </Suspense>
                  </div>
                } />

                <Route path="/configure/platform/tenants/:id/*" element={
                  <AsyncBoundary fallback={<LoadingFallback />}>
                    <SubNav
                      title="Tenant Details"
                      description="View and manage tenant configuration"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <LazyTenantDetailPage />
                      </Suspense>
                    </SubNav>
                  </AsyncBoundary>
                } />

                <Route path="/" element={<Navigate to="/onboarding" />} />
                
                <Route path="*" element={
                  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-fw-wash">
                    <div className="flex flex-col items-start max-w-[350px]">
                      <h1 className="text-[48px] font-bold text-fw-heading tracking-[-0.03em] mb-4">Page not found.</h1>
                      <p className="text-[14px] font-medium text-fw-body tracking-[-0.03em] mb-8">
                        We couldn't find the page you're looking for. It might have been moved or doesn't exist anymore.
                      </p>
                      <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center h-9 px-6 bg-fw-active text-white rounded-full text-[14px] font-medium hover:bg-fw-linkHover transition-colors"
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                } />
                  </Routes>
                </main>
              </DashboardLayout>
            } />
          </Routes>
        </ErrorBoundary>
        
        {!isDetachedWindow && !isStandalonePage && (
          <>
            <MobileMenu
              isOpen={false}
              onClose={() => {}}
              userInfo={userInfo}
              notifications={3}
            />
            {/* SmartAssistant removed */}
            <FeedbackWidget />
            <DemoRoleSwitcher />
            <MaintenanceModal
              isOpen={showMaintenance}
              onClose={() => setShowMaintenance(false)}
              schedule={maintenanceSchedule}
              variant="modal"
            />
            <ProductTour
              steps={mainAppTour}
              isOpen={tour.isOpen}
              onClose={tour.closeTour}
              onComplete={tour.completeTour}
              storageKey="tour-main-app-completed"
            />
          </>
        )}
      </ThemeProvider>
    </NavigationStateProvider>
  );
}

export default memo(App);