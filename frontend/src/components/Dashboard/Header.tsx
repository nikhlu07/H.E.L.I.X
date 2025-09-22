import React, { useState, useEffect, useRef } from 'react';
import { Shield, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';

const roleDisplay: Record<string, { icon: string; name: string }> = {
  lead_agency: { icon: '🌍', name: 'Lead Agency' },
  field_director: { icon: '🏆', name: 'Field Director' },
  program_manager: { icon: '👨‍💼', name: 'Program Manager' },
  logistics_partner: { icon: '🚚', name: 'Logistics Partner' },
  local_supplier: { icon: '📦', name: 'Local Supplier' },
  auditor: { icon: '👩‍💻', name: 'Auditor' },
  default: { icon: '👤', name: 'User' },
};

const sectorDisplay: Record<string, { icon: string; name: string }> = {
  government: { icon: '🌍', name: 'Humanitarian' },
  default: { icon: '🌍', name: 'Humanitarian' },
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRoleSwitcher(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  if (!user) return null;

  const currentRole = user.role;
  const currentRoleDisplay = roleDisplay[currentRole] || roleDisplay.default;
  const currentSectorDisplay = sectorDisplay[sector] || sectorDisplay.default;

  const handleRoleSwitch = (newRole: string) => {
    // This is a demo feature; it reloads the page to simulate a role change.
    // In a real app, this would involve a state change and re-authentication.
    console.log(`Switching to role: ${newRole}`);
    setShowRoleSwitcher(false);
    // You might need a more sophisticated way to manage demo state
    // For now, we can imagine it sets a cookie/localStorage and reloads.
    window.location.reload(); 
  };

  const availableRoles = Object.keys(roleDisplay).filter(r => r !== 'default');

  return (
    <header className="bg-helix-dark shadow-lg border-b border-helix-gray-700">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo, Title, and Badges */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">H.E.L.I.X.</h1>
            </div>
            
            <div className="flex items-center space-x-2 bg-helix-gray-800 rounded-full px-3 py-1 border border-helix-gray-700">
              <span>{currentSectorDisplay.icon}</span>
              <span className="text-foreground font-medium capitalize text-sm">
                {currentSectorDisplay.name}
              </span>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center space-x-2 bg-helix-gray-800 rounded-full px-4 py-2 border border-helix-gray-700 hover:bg-helix-gray-700 transition-colors"
              >
                <span>{currentRoleDisplay.icon}</span>
                <span className="text-foreground font-medium">
                  {currentRoleDisplay.name}
                </span>
                <ChevronDown className="h-4 w-4 text-primary" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-helix-gray-900 rounded-xl shadow-2xl border border-helix-gray-700 z-50">
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-helix-gray-400 px-2 pt-1 pb-2">Switch Demo Role</h3>
                    <div className="space-y-1">
                      {availableRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleSwitch(role)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            role === currentRole
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-helix-gray-800 text-helix-gray-300'
                          }`}
                        >
                          <span>{roleDisplay[role].icon}</span>
                          <span className="font-medium text-sm">{roleDisplay[role].name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-helix-gray-300 hover:bg-helix-gray-800 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 text-helix-gray-300 hover:bg-helix-gray-800 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <div className="w-px h-6 bg-helix-gray-700"></div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-foreground font-medium text-sm">
                  {currentRoleDisplay.name}
                </div>
                <div className="text-helix-gray-400 text-xs">
                  {user.isAuthenticated ? 'Authenticated' : 'Demo Mode'}
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-helix-gray-800 rounded-lg px-3 py-2 border border-helix-gray-700 hover:bg-red-900/50 hover:border-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
