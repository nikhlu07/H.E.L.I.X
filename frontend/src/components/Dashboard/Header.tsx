import React, { useState, useEffect, useRef } from 'react';
import { Shield, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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

export function Header() {
  const { user, logout, login } = useAuth();
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
      await login('demo', newRole);
      setShowRoleSwitcher(false);
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
              <Shield className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">CorruptGuard</h1>
            </div>
            
            {/* Role Badge with Demo Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <span className="text-xl">{roleIcon}</span>
                <span className="text-white font-medium capitalize">
                  {user.role.replace('_', ' ')}
                </span>
                <ChevronDown className="h-4 w-4 text-white/80" />
              </button>

              {/* Role Switcher Dropdown */}
              {showRoleSwitcher && (
                <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-48 z-50">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                    Demo Mode - Switch Role
                  </div>
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-3 ${
                        role === userRole ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{roleIcons[role]}</span>
                      <div>
                        <div className="font-medium">
                          {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-xs text-slate-500">
                          {role === userRole ? 'Current role' : 'Switch to this role'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {/* Settings */}
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-white" />
            </button>

            {/* User Info */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <div className="text-2xl">{roleIcon}</div>
              <div className="text-white">
                <div className="font-semibold text-sm">{user.name}</div>
                <div className="text-white/80 text-xs">
                  {user.role.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors group"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-white group-hover:text-red-300" />
            </button>
          </div>
        </div>

        {/* ICP Status Bar */}
        <div className="mt-4 flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
          <div className="flex items-center space-x-4 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>ICP Connected</span>
            </div>
            {/* Use the correct property name */}
            <div>Principal: <code className="bg-white/10 px-2 py-1 rounded text-xs font-mono">{user.principal_id || 'Not connected'}</code></div>
          </div>
          <div className="text-white/80 text-sm">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </header>
  );
}