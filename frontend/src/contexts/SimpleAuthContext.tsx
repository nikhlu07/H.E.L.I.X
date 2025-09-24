import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { internetIdentity, User } from '../auth/simpleII';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      await internetIdentity.init();

      // Check if user is already authenticated (stored in localStorage)
      const storedUser = localStorage.getItem('ii_user');
      const storedToken = localStorage.getItem('ii_token');

      if (storedUser && storedToken && internetIdentity.getToken() === storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (initError) {
      console.error('Auth initialization failed:', initError);
      setError('Authentication service failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      console.log('🔐 Starting Internet Identity login...');
      setLoading(true);
      setError(null);

      const loggedInUser = await internetIdentity.login();
      setUser(loggedInUser);

      console.log('✅ Login successful!');
    } catch (loginError: unknown) {
      console.error('Login failed:', loginError);
      setError((loginError as Error).message || 'Login failed');
      throw loginError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await internetIdentity.logout();
      setUser(null);

      console.log('✅ Logout successful');
    } catch (logoutError: unknown) {
      console.error('Logout failed:', logoutError);
      setError((logoutError as Error).message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    return internetIdentity.hasRole(role);
  };

  const hasPermission = (permission: string): boolean => {
    return internetIdentity.hasPermission(permission);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated: internetIdentity.isAuthenticated(),
    login,
    logout,
    hasRole,
    hasPermission,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
