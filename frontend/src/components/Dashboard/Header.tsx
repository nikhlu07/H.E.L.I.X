import React from 'react';
import { LogOut, User, Settings, Bell } from 'lucide-react';

interface User {
  role: string;
  sector: string;
  isAuthenticated: boolean;
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
  sector: string;
}

export function Header({ user, onLogout, sector }: HeaderProps) {
  const getRoleDisplayName = (role: string): string => {
    const roleMap: Record<string, string> = {
      'lead_agency': 'Lead Agency Director',
      'field_director': 'Field Director',
      'program_manager': 'Program Manager',
      'logistics_partner': 'Logistics Partner',
      'local_supplier': 'Local Supplier',
      'auditor': 'Auditor',
    };
    return roleMap[role] || role.replace('_', ' ').toUpperCase();
  };

  const getSectorDisplayName = (sector: string): string => {
    const sectorMap: Record<string, string> = {
      'government': 'Government',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'infrastructure': 'Infrastructure',
      'defense': 'Defense',
    };
    return sectorMap[sector] || sector;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="H.E.L.I.X."
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">H.E.L.I.X. Dashboard</h1>
              <p className="text-sm text-gray-500">
                {getSectorDisplayName(sector)} • {getRoleDisplayName(user.role)}
              </p>
            </div>
          </div>

          {/* Right side - User menu and actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* User profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {getRoleDisplayName(user.role)}
                </p>
                <p className="text-xs text-gray-500">
                  {getSectorDisplayName(sector)}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}