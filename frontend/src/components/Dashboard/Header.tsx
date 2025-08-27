import React, { useState, useEffect, useRef } from 'react';
import { Shield, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';

// Define the role type properly
type UserRole = 'main_government' | 'state_head' | 'deputy' | 'vendor' | 'sub_supplier' | 'citizen';

const roleColors: Record<UserRole, string> = {
  'main_government': 'from-blue-700 to-blue-800',
  'state_head': 'from-emerald-600 to-emerald-700',
  'deputy': 'from-orange-600 to-orange-700',
  'vendor': 'from-purple-600 to-purple-700',
  'sub_supplier': 'from-teal-600 to-teal-700',
  'citizen': 'from-slate-600 to-slate-700'
};

const roleIcons: Record<UserRole, string> = {
  'main_government': '🏛️',
  'state_head': '🏆',
  'deputy': '👨‍💼',
  'vendor': '🏗️',
  'sub_supplier': '📦',
  'citizen': '👩‍💻'
};

const sectorIcons: Record<string, string> = {
  'government': '🏛️',
  'healthcare': '🏥',
  'education': '🎓',
  'corporate': '🏢'
};

interface User {
  role: string;
  sector: string;
  isAuthenticated: boolean;
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
  sector?: string;
}

export function Header({ user, onLogout, sector = 'government' }: HeaderProps) {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRoleSwitcher(false);
      }
    }

    if (showRoleSwitcher) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showRoleSwitcher]);

  if (!user) return null;

  // Fix the property names to match your User interface
  const userRole = user.role as UserRole;
  const gradient = roleColors[userRole] || roleColors.citizen;
  const roleIcon = roleIcons[userRole] || roleIcons.citizen;

  const handleRoleSwitch = async (newRole: UserRole) => {
    try {
      // For demo mode, we can switch roles easily
      // For ICP mode, this would require re-authentication
      if (user.sector === 'government') {
        // Update the user role (in a real app, this would require backend validation)
        user.role = newRole;
        setShowRoleSwitcher(false);
        // Force a re-render
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  const availableRoles: UserRole[] = ['main_government', 'state_head', 'deputy', 'vendor', 'sub_supplier', 'citizen'];

  return (
    <header className={`bg-gradient-to-r ${gradient} shadow-xl border-b border-white/20`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt="CorruptGuard Logo" className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-white">CorruptGuard</h1>
            </div>
            
            {/* Sector Badge */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
              <span className="text-lg">{sectorIcons[sector] || '🏛️'}</span>
              <span className="text-white font-medium capitalize text-sm">
                {sector}
              </span>
            </div>
            
            {/* Role Badge with Demo Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <span className="text-xl">{roleIcon}</span>
                <span className="text-white font-medium capitalize">
                  {userRole.replace('_', ' ')}
                </span>
                <ChevronDown className="h-4 w-4 text-white" />
              </button>

              {/* Role Switcher Dropdown */}
              {showRoleSwitcher && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Switch Role</h3>
                    <div className="space-y-2">
                      {availableRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleSwitch(role)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            role === userRole
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-lg">{roleIcons[role]}</span>
                          <span className="font-medium capitalize">
                            {role.replace('_', ' ')}
                          </span>
                          {role === userRole && (
                            <span className="ml-auto text-blue-600 text-sm">Current</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="text-white/80 text-xs">
                  {user.isAuthenticated ? 'Authenticated' : 'Demo Mode'}
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <LogOut className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}