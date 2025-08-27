import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { MainGovernmentDashboard } from './components/Dashboard/MainGovernmentDashboard';
import { StateHeadDashboard } from './components/Dashboard/StateHeadDashboard';
import { DeputyDashboard } from './components/Dashboard/DeputyDashboard';
import { VendorDashboard } from './components/Dashboard/VendorDashboard';
import { SubSupplierDashboard } from './components/Dashboard/SubSupplierDashboard';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';
import { GenericDashboard } from './components/Dashboard/GenericDashboard';
import { Header } from './components/Dashboard/Header';
import { AuthTest } from './components/Test/AuthTest';
import corruptGuardService from './services/corruptGuardService';
import demoModeService from './services/demoMode';

type ViewType = 'landing' | 'login' | 'dashboard' | 'auth-test';

interface User {
  role: string;
  sector: string;
  isAuthenticated: boolean;
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>('government');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the service and check authentication status
    const initializeApp = async () => {
      try {
        await corruptGuardService.init();
        
        // Check for demo user first
        const demoUser = await demoModeService.getCurrentUser();
        if (demoUser) {
          setUser({
            role: demoUser.role,
            sector: 'government',
            isAuthenticated: true
          });
          setCurrentView('dashboard');
          setIsLoading(false);
          return;
        }
        
        // Check if user is already authenticated
        const currentUser = await corruptGuardService.getCurrentUser();
        if (currentUser && corruptGuardService.isAuthenticated()) {
          setUser({
            role: currentUser.role,
            sector: 'government', // Default to government for authenticated users
            isAuthenticated: true
          });
          setCurrentView('dashboard');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleGetStarted = () => {
    setCurrentView('login');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setUser(null);
  };

  const handleLogin = async (role: string, sector: string) => {
    setSelectedSector(sector);
    setUser({
      role,
      sector,
      isAuthenticated: true
    });
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      // Logout from both services
      await corruptGuardService.logout();
      await demoModeService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setCurrentView('landing');
  };

  const handleShowAuthTest = () => {
    setCurrentView('auth-test');
  };

  const renderDashboard = () => {
    if (!user) return null;

    // For government sector, render specific dashboards
    if (selectedSector === 'government') {
      switch (user.role) {
        case 'main_government':
          return <MainGovernmentDashboard />;
        case 'state_head':
          return <StateHeadDashboard />;
        case 'deputy':
          return <DeputyDashboard />;
        case 'vendor':
          return <VendorDashboard />;
        case 'sub_supplier':
          return <SubSupplierDashboard />;
        case 'citizen':
          return <CitizenDashboard />;
        default:
          return <MainGovernmentDashboard />;
      }
    }

    // For other sectors, render generic dashboard
    return <GenericDashboard sector={selectedSector} role={user.role} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing CorruptGuard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'landing' && (
        <div>
          <LandingPage onGetStarted={handleGetStarted} />
          {/* Add a small test button in the corner */}
          <button
            onClick={handleShowAuthTest}
            className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors z-50"
          >
            🔐 Test Auth
          </button>
        </div>
      )}
      
      {currentView === 'login' && (
        <div>
          <LoginPage 
            onLogin={handleLogin} 
            onBackToLanding={handleBackToLanding}
          />
          {/* Add a small test button in the corner */}
          <button
            onClick={handleShowAuthTest}
            className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors z-50"
          >
            🔐 Test Auth
          </button>
        </div>
      )}
      
      {currentView === 'dashboard' && user && (
        <div className="min-h-screen bg-gray-50">
          <Header 
            user={user} 
            onLogout={handleLogout}
            sector={selectedSector}
          />
          {renderDashboard()}
        </div>
      )}

      {currentView === 'auth-test' && (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBackToLanding}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Back to App
                  </button>
                  <h1 className="text-xl font-bold text-gray-900">Authentication Test</h1>
                </div>
              </div>
            </div>
          </div>
          <AuthTest />
        </div>
      )}
    </div>
  );
}

export default App;