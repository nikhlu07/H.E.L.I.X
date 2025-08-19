import React, { useState } from 'react';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { Header } from './components/Dashboard/Header';
import { MainGovernmentDashboard } from './components/Dashboard/MainGovernmentDashboard';
import { StateHeadDashboard } from './components/Dashboard/StateHeadDashboard';
import { DeputyDashboard } from './components/Dashboard/DeputyDashboard';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';
import { VendorDashboard } from './components/Dashboard/VendorDashboard';
import { SubSupplierDashboard } from './components/Dashboard/SubSupplierDashboard';
import { useAuth } from './contexts/AuthContext';

// App uses global AuthContext; no local user state.

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const { user, login } = useAuth();

  const handleGetStarted = () => {
    setCurrentView('login');
  };

  const handleLogin = (role: string) => {
    // Use global AuthContext login in demo mode
    login('demo', role)
      .then(() => setCurrentView('dashboard'))
      .catch((e) => console.error('Login failed:', e));
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const renderDashboard = () => {
    if (!user) return null;

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
        return <CitizenDashboard />;
    }
  };

  // Landing page
  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Login page
  if (currentView === 'login') {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  // Dashboard (logged in)
  if (currentView === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        {renderDashboard()}
      </div>
    );
  }

  // Fallback
  return <LandingPage onGetStarted={handleGetStarted} />;
}

export default App;