import React from 'react';
import { Routes, Route, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { NgoLoginPage } from './components/Auth/NgoLoginPage';
import { MainGovernmentDashboard } from './components/Dashboard/MainGovernmentDashboard';
import { VendorDashboard } from './components/Dashboard/VendorDashboard';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';
import { StateHeadDashboard } from './components/Dashboard/StateHeadDashboard';
import { DeputyDashboard } from './components/Dashboard/DeputyDashboard';
import { Header } from './components/Dashboard/Header';
import { NgoHeader } from './components/Dashboard/NgoHeader';
import { AuthProvider } from './contexts/AuthContext';
import {SubSupplierDashboard} from "./components/Dashboard/SubSupplierDashboard.tsx";
import {AuditorDashboard} from "./components/Dashboard/AuditorDashboard.tsx";
import Profile from './components/Dashboard/Profile.tsx';
import { DeputyProfile } from './components/Dashboard/DeputyProfile.tsx';
import { PrincipalRoleManager } from './components/Admin/PrincipalRoleManager.tsx';
import PitchPage from './pages/pitch/index.tsx';
import Documentation from './docs/documentation.tsx';
import { NgoHeadDashboard } from './components/Dashboard/NgoHeadDashboard';
import { NgoProgramManagerDashboard } from './components/Dashboard/NgoProgramManagerDashboard';
import { NgoFieldOfficerDashboard } from './components/Dashboard/NgoFieldOfficerDashboard';
import { NgoVolunteerCoordinatorDashboard } from './components/Dashboard/NgoVolunteerCoordinatorDashboard';
import { NgoAdminDashboard } from './components/Dashboard/NgoAdminDashboard';

function DashboardLayout() {
  const location = useLocation();
  const isNgoRoute = location.pathname.startsWith('/dashboard/ngo');

  return (
    <>
      {isNgoRoute ? <NgoHeader /> : <Header />}
      <main className="pt-20">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = (role: string, sector: string) => {
    const dashboardMap: Record<string, string> = {
      'main_government': '/dashboard/government',
      'state_head': '/dashboard/state-head',
      'deputy': '/dashboard/deputy',
      'vendor': '/dashboard/vendor',
      'sub_supplier': '/dashboard/sub-supplier',
      'citizen': '/dashboard/citizen',
      'auditor': '/dashboard/auditor',
      'profile':'/dashboard/profile',
      'ngo_head': '/dashboard/ngo-head',
      'ngo_program_manager': '/dashboard/ngo-program-manager',
      'ngo_field_officer': '/dashboard/ngo-field-officer',
      'ngo_volunteer_coordinator': '/dashboard/ngo-volunteer-coordinator',
      'ngo_admin': '/dashboard/ngo-admin',
    };

    const dashboardPath = dashboardMap[role] || (sector === 'ngo' ? '/dashboard/ngo-head' : '/dashboard/government');
    navigate(dashboardPath);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            <LandingPage/>
          } />
          <Route path="/login" element={
            <LoginPage onLogin={handleLoginSuccess} />
          } />
          <Route path="/login/ngo" element={
            <NgoLoginPage onLogin={handleLoginSuccess} />
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/deputy-profile" element={<DeputyProfile />} />
          <Route path="/demo" element={<div className="p-8 text-center"><h1 className="text-2xl">Demo Mode Coming Soon!</h1></div>} />
          <Route path="/role-selection" element={<div className="p-8 text-center"><h1 className="text-2xl">Role Selection Coming Soon!</h1></div>} />
          {/*<Route path="/pitch" element={<PitchPage />} />*/}
          <Route path="/docs" element={<Documentation />} />

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
            <Route path="ngo-head" element={<NgoHeadDashboard />} />
            <Route path="ngo-program-manager" element={<NgoProgramManagerDashboard />} />
            <Route path="ngo-field-officer" element={<NgoFieldOfficerDashboard />} />
            <Route path="ngo-volunteer-coordinator" element={<NgoVolunteerCoordinatorDashboard />} />
            <Route path="ngo-admin" element={<NgoAdminDashboard />} />
          </Route>
          
          {/* Admin Panel for Role Management */}
          <Route path="/admin/roles" element={<DashboardLayout />}>
            <Route index element={<PrincipalRoleManager />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
