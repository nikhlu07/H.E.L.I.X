import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { Header } from './components/Dashboard/Header';
import { AuthTest } from './components/Test/AuthTest';
import { DemoTest } from './components/Test/DemoTest';
import { MultiCountryDemo } from './components/Demo/MultiCountryDemo';
import helixService from './services/helixService';
import demoModeService from './services/demoMode';

// Import i18n configuration
import './i18n';
import { culturalAdaptationService } from './services/culturalAdaptation';

// Import cultural styles
import './styles/cultural.css';

// Import the new dashboard components
import { LeadAgencyDashboard } from './components/Dashboard/LeadAgencyDashboard';
import { FieldDirectorDashboard } from './components/Dashboard/FieldDirectorDashboard';
import { ProgramManagerDashboard } from './components/Dashboard/ProgramManagerDashboard';
import { LogisticsPartnerDashboard } from './components/Dashboard/LogisticsPartnerDashboard';
import { LocalSupplierDashboard } from './components/Dashboard/LocalSupplierDashboard';
import { AuditorDashboard } from './components/Dashboard/AuditorDashboard';
import { CompetitionEntry } from './components/Competition/CompetitionEntry';

type ViewType = 'landing' | 'login' | 'dashboard' | 'auth-test' | 'demo-test' | 'multi-country-demo' | 'competition';

interface User {
  role: string;
  sector: string;
  isAuthenticated: boolean;
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for demo test mode in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('test') === 'demo') {
          setCurrentView('demo-test');
          setIsLoading(false);
          return;
        }
        if (urlParams.get('demo') === 'multi-country') {
          setCurrentView('multi-country-demo');
          setIsLoading(false);
          return;
        }
        if (urlParams.get('mode') === 'competition') {
          setCurrentView('competition');
          setIsLoading(false);
          return;
        }

        // Initialize cultural adaptation
        culturalAdaptationService.applyCulturalTheme();
        culturalAdaptationService.initializeLanguageListener();

        await helixService.init();
        const demoUser = await demoModeService.getCurrentUser();
        if (demoUser) {
          setUser({ ...demoUser, sector: 'government' });
          setCurrentView('dashboard');
        } else {
          const currentUser = await helixService.getCurrentUser();
          if (currentUser && helixService.isAuthenticated()) {
            setUser({ ...currentUser, sector: 'government' });
            setCurrentView('dashboard');
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleLogin = (role: string, sector: string) => {
    setUser({ role, sector, isAuthenticated: true });
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await helixService.logout();
    await demoModeService.logout();
    setUser(null);
    setCurrentView('landing');
  };

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'lead_agency':
        return <LeadAgencyDashboard />;
      case 'field_director':
        return <FieldDirectorDashboard />;
      case 'program_manager':
        return <ProgramManagerDashboard />;
      case 'logistics_partner':
        return <LogisticsPartnerDashboard />;
      case 'local_supplier':
        return <LocalSupplierDashboard />;
      case 'auditor':
        return <AuditorDashboard />;
      default:
        return <LeadAgencyDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Initializing H.E.L.I.X....</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={() => setCurrentView('login')} 
          onTryDemo={async () => {
            // Try ICP Demo - go to login page with ICP pre-selected
            setCurrentView('login');
          }}
          onTryLiveDemo={async () => {
            // Try Live Demo - directly login with demo mode as lead_agency
            try {
              await demoModeService.loginWithDemo('lead_agency');
              setUser({ role: 'lead_agency', sector: 'government', isAuthenticated: true });
              setCurrentView('dashboard');
            } catch (error) {
              console.error('Demo login failed:', error);
              setCurrentView('login');
            }
          }}
          onMultiCountryDemo={() => setCurrentView('multi-country-demo')}
        />
      )}
      
      {currentView === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <div className="min-h-screen bg-background">
          <Header 
            user={user} 
            onLogout={handleLogout}
            sector={user.sector}
          />
          {renderDashboard()}
        </div>
      )}

      {currentView === 'auth-test' && (
        <div className="min-h-screen bg-background">
          {/* AuthTest component can be added back if needed */}
        </div>
      )}

      {currentView === 'demo-test' && <DemoTest />}

      {currentView === 'multi-country-demo' && (
        <MultiCountryDemo onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'competition' && <CompetitionEntry />}
    </div>
  );
}

export default App;