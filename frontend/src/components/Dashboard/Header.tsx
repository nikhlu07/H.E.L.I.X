import React, { useState, useEffect, useRef } from 'react';
import { Shield, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const roleDisplay: Record<string, { icon: string; name: string }> = {
  main_government: { icon: '🌍', name: 'Government Official' },
  state_head: { icon: '🏆', name: 'State Head' },
  deputy: { icon: '👨‍💼', name: 'Deputy Officer' },
  vendor: { icon: '🚚', name: 'Vendor/Contractor' },
  sub_supplier: { icon: '📦', name: 'Sub-Supplier' },
  citizen: { icon: '👩‍💻', name: 'Citizen Observer' },
  auditor: { icon: '🔍', name: 'Auditor' },
  default: { icon: '👤', name: 'User' },
};

const sectorDisplay: Record<string, { icon: string; name: string }> = {
  government: { icon: '🏛️', name: 'Government Procurement' },
  default: { icon: '🏛️', name: 'Government Procurement' },
};

interface User {
  role: string;
  sector: string;
  isAuthenticated: boolean;
}

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
  sector?: string;
}

export function Header({ user, onLogout, sector = 'government' }: HeaderProps) {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const { user: ctxUser, login, logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRoleSwitcher(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const currentUser = ctxUser || user || { role: 'citizen', sector: 'government', isAuthenticated: false };

  const currentRole = currentUser.role;
  const currentRoleDisplay = roleDisplay[currentRole] || roleDisplay.default;
  const currentSectorDisplay = sectorDisplay[sector] || sectorDisplay.default;

  const roleRoutes: Record<string, string> = {
    main_government: '/dashboard/government',
    state_head: '/dashboard/state-head',
    deputy: '/dashboard/deputy',
    vendor: '/dashboard/vendor',
    sub_supplier: '/dashboard/sub-supplier',
    citizen: '/dashboard/citizen',
    auditor: '/dashboard/auditor',
  };

  const handleRoleSwitch = async (newRole: string) => {
    try {
      // Use demo login flow to switch the role in AuthContext
      await login('demo', newRole)
      setShowRoleSwitcher(false);
      const target = roleRoutes[newRole] || '/dashboard/generic'
      navigate(target)
    } catch (e) {
      console.error('Failed to switch role', e)
      // Fallback: close dropdown but keep user as-is
      setShowRoleSwitcher(false)
      // Optionally, display a lightweight alert (Toast system exists in app)
      // window.alert('Failed to switch role. Please try again.')
    }
  };

  const availableRoles = Object.keys(roleDisplay).filter(r => r !== 'default');

  return (
    <header className="bg-helix-gray-900 shadow-xl border-b-2 border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary drop-shadow-lg" />
            <h1 className="text-2xl font-bold text-white">H.E.L.I.X.</h1>
          </div>

          {/* Center - Sector Badge */}
          <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 border border-primary/30">
            <ChevronDown className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold capitalize text-sm">
              Government Procurement
            </span>
          </div>

          {/* Right side - Role Switcher, Actions and User */}
          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center space-x-2 bg-helix-gray-800 rounded-full px-4 py-2 border border-primary/50 hover:bg-helix-gray-700 hover:border-primary transition-all duration-200"
              >
                <span className="text-white font-medium">
                  {(roleDisplay[currentUser.role] || roleDisplay.default).name}
                </span>
                <ChevronDown className="h-4 w-4 text-primary" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-helix-gray-800 rounded-xl shadow-2xl border border-primary/30 z-50">
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-primary px-2 pt-1 pb-2">Switch Demo Role</h3>
                    {availableRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSwitch(role)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentUser.role === role
                            ? 'bg-primary/20 text-primary font-medium'
                            : 'hover:bg-helix-gray-700 text-white'
                        }`}
                      >
                        {roleDisplay[role].name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-white hover:bg-helix-gray-800 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-white hover:bg-helix-gray-800 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-helix-gray-600"></div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  {(roleDisplay[currentUser.role] || roleDisplay.default).name}
                </div>
                <div className="text-helix-gray-400 text-xs">
                  {currentUser.role}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={onLogout ? onLogout : logout}
                className="flex items-center space-x-2 bg-red-900/30 rounded-lg px-3 py-2 border border-red-700/50 hover:bg-red-900/50 hover:border-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
