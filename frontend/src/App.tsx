import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { Header } from './components/Dashboard/Header';
import { AuthTest } from './components/Test/AuthTest';
import helixService from './services/helixService';
import demoModeService from './services/demoMode';

// Import the new dashboard components
import { LeadAgencyDashboard } from './components/Dashboard/LeadAgencyDashboard';
import { FieldDirectorDashboard } from './components/Dashboard/FieldDirectorDashboard';
import { ProgramManagerDashboard } from './components/Dashboard/ProgramManagerDashboard';
import { LogisticsPartnerDashboard } from './components/Dashboard/LogisticsPartnerDashboard';
import { LocalSupplierDashboard } from './components/Dashboard/LocalSupplierDashboard';
import { AuditorDashboard } from './components/Dashboard/AuditorDashboard';

type ViewType = 'landing' | 'login' | 'dashboard' | 'auth-test';

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
        <LandingPage onGetStarted={() => setCurrentView('login')} />
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
    </div>
  );
}

export default App;