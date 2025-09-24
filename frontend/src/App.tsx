import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { MainGovernmentDashboard } from './components/Dashboard/MainGovernmentDashboard';
import { VendorDashboard } from './components/Dashboard/VendorDashboard';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';
import { StateHeadDashboard } from './components/Dashboard/StateHeadDashboard';
import { DeputyDashboard } from './components/Dashboard/DeputyDashboard';
import { Header } from './components/Dashboard/Header';
import { AuthProvider } from './contexts/AuthContext';

function DashboardLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLoginSuccess = (role: string, sector: string) => {
    // Navigate to appropriate dashboard based on role
    const dashboardMap: Record<string, string> = {
      'main_government': '/dashboard/government',
      'state_head': '/dashboard/state-head',
      'deputy': '/dashboard/deputy',
      'vendor': '/dashboard/vendor',
      'citizen': '/dashboard/citizen'
    };

    const dashboardPath = dashboardMap[role] || '/dashboard/government';
    navigate(dashboardPath);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <LandingPage
              onGetStarted={handleGetStarted}
            />
          } />
          <Route path="/login" element={
            <LoginPage
              onLogin={(role: string, sector: string) => handleLoginSuccess(role, sector)}
              onBackToLanding={() => navigate('/')}
            />
          } />
          <Route path="/demo" element={<div className="p-8 text-center"><h1 className="text-2xl">Demo Mode Coming Soon!</h1></div>} />
          <Route path="/role-selection" element={<div className="p-8 text-center"><h1 className="text-2xl">Role Selection Coming Soon!</h1></div>} />

          {/* Dashboard routes wrapped with common header */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="government" element={<MainGovernmentDashboard />} />
            <Route path="citizen" element={<CitizenDashboard />} />
            <Route path="vendor" element={<VendorDashboard />} />
            <Route path="state-head" element={<StateHeadDashboard />} />
            <Route path="deputy" element={<DeputyDashboard />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;