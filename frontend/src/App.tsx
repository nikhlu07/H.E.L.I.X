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
import {SubSupplierDashboard} from "./components/Dashboard/SubSupplierDashboard.tsx";
import {AuditorDashboard} from "./components/Dashboard/AuditorDashboard.tsx";
import Profile from './components/Dashboard/Profile.tsx';

function DashboardLayout() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
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
        'sub_supplier': '/dashboard/sub-supplier',
      'citizen': '/dashboard/citizen',
        'auditor': '/dashboard/auditor',
        'profile':'/dashboard/profile'
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/demo" element={<div className="p-8 text-center"><h1 className="text-2xl">Demo Mode Coming Soon!</h1></div>} />
          <Route path="/role-selection" element={<div className="p-8 text-center"><h1 className="text-2xl">Role Selection Coming Soon!</h1></div>} />

          {/* Dashboard routes wrapped with common header */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="government" element={<MainGovernmentDashboard />} />
              <Route path="sub-supplier" element={<SubSupplierDashboard />} />
            <Route path="citizen" element={<CitizenDashboard />} />
            <Route path="vendor" element={<VendorDashboard />} />
            <Route path="state-head" element={<StateHeadDashboard />} />
            <Route path="deputy" element={<DeputyDashboard />} />
              <Route path="auditor" element={<AuditorDashboard />} />
              <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
