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

// Simple mock user state (without complex AuthContext)
interface User {
  role: string;
  name: string;
  principal_id: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);

  const handleGetStarted = () => {
    setCurrentView('login');
  };

  const handleLogin = (role: string) => {
    // Mock login - create user based on role
    const mockUser: User = {
      role: role,
      name: getRoleName(role),
      principal_id: `demo-${role}-${Math.random().toString(36).substr(2, 8)}`
    };
    setUser(mockUser);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    // Try to logout from Internet Identity if available
    try {
      const { authService } = await import('./services/authService');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setCurrentView('landing');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const getRoleName = (role: string): string => {
    switch (role) {
      case 'main_government': return 'Government Official';
      case 'state_head': return 'State Head';
      case 'deputy': return 'Deputy Officer';
      case 'vendor': return 'Vendor/Contractor';
      case 'citizen': return 'Citizen Observer';
      default: return 'User';
    }
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
        <Header user={user} onLogout={handleLogout} />
        {renderDashboard()}
      </div>
    );
  }

  // Fallback
  return <LandingPage onGetStarted={handleGetStarted} />;
}

export default App;