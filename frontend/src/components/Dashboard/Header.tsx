import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings, ChevronDown, Menu, X, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user: ctxUser, login, logout } = useAuth();

  useEffect(() => {
    if (location.pathname === '/') return;

    const header = document.getElementById('app-header');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header?.classList.add('bg-white/80', 'backdrop-blur-sm', 'border-b', 'border-gray-200', 'shadow-sm');
      } else {
        header?.classList.remove('bg-white/80', 'backdrop-blur-sm', 'border-b', 'border-gray-200', 'shadow-sm');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const currentUser = ctxUser || user || { role: 'citizen', sector: 'government', isAuthenticated: false };
  const currentRoleName = (roleDisplay[currentUser.role] || roleDisplay.default).name;

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
      await login('demo', newRole);
      const target = roleRoutes[newRole] || '/dashboard/generic';
      navigate(target);
    } catch (e) {
      console.error('Failed to switch role', e);
    }
  };

  const availableRoles = Object.keys(roleDisplay).filter(r => r !== 'default');

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
    setMobileMenuOpen(false);
  };

  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300" id="app-header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Helix Logo" className="h-8 w-auto" />
              <span className="ml-3 text-2xl font-bold tracking-tighter text-gray-800">Helix</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 bg-yellow-400 text-black hover:bg-yellow-400/90 focus-visible:ring-yellow-500">
                  <span>{currentRoleName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 bg-white shadow-lg rounded-lg border">
                <DropdownMenuLabel>Switch Demo Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableRoles.map((role) => (
                  <DropdownMenuItem key={role} onClick={() => handleRoleSwitch(role)} disabled={currentUser.role === role}>
                    {roleDisplay[role].name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <div className="text-right">
                    <div className="font-semibold text-sm">{currentRoleName}</div>
                    <div className="text-xs text-gray-500">{currentUser.role}</div>
                  </div>
                  <UserIcon className="h-8 w-8 rounded-full bg-yellow-100 p-1 text-yellow-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-2 bg-white shadow-lg rounded-lg border">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 px-3 mb-2">Switch Demo Role</h3>
              <div className="flex flex-col gap-1">
                {availableRoles.map((role) => (
                  <Button
                    key={role}
                    variant={currentUser.role === role ? 'secondary' : 'ghost'}
                    className="justify-start"
                    onClick={() => { handleRoleSwitch(role); setMobileMenuOpen(false); }}
                  >
                    {roleDisplay[role].name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200" />

            <div className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Button>
              <Button variant="ghost" asChild className="justify-start gap-2">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </Button>
            </div>

            <div className="border-t border-gray-200" />

            <Button variant="ghost" onClick={handleLogout} className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
