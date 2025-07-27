// frontend/src/auth/authService.ts - NEW
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'http://localhost:8000');

export interface User {
  principal_id: string;
  role: 'main_government' | 'state_head' | 'deputy' | 'vendor' | 'sub_supplier' | 'citizen';
  name: string;
  title: string;
  permissions: string[];
  authenticated_at: string;
  user_info?: any;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  principal_id: string;
  role: string;
  user_info: any;
  expires_in: number;
  demo_mode?: boolean;
}

class AuthService {
  private authClient: AuthClient | null = null;
  private user: User | null = null;
  private token: string | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  async init(): Promise<void> {
    try {
      this.authClient = await AuthClient.create();
      
      // Check if user is already authenticated
      if (await this.authClient.isAuthenticated()) {
        const identity = this.authClient.getIdentity();
        await this.handleInternetIdentityAuth(identity);
      } else {
        // Check for existing token in localStorage
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        
        if (savedToken && savedUser) {
          this.token = savedToken;
          this.user = JSON.parse(savedUser);
          this.setupTokenRefresh();
        }
      }
    } catch (error) {
      console.error('Auth service initialization failed:', error);
    }
  }

  async loginWithInternetIdentity(): Promise<User> {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: import.meta.env.VITE_II_URL || (import.meta.env.DEV ? 'http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaah-qcaiq-cai' : 'https://identity.ic0.app'),
        onSuccess: async () => {
          try {
            const identity = this.authClient!.getIdentity();
            const user = await this.handleInternetIdentityAuth(identity);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        },
        onError: (error) => {
          console.error('Internet Identity login failed:', error);
          reject(new Error('Internet Identity login failed'));
        }
      });
    });
  }

  async loginDemo(role: string): Promise<User> {
    try {
      console.log(`Attempting demo login for role: ${role}`);
      
      // First, try to use the real backend API
      try {
        const response = await fetch(`${API_BASE_URL}/auth/demo-login/${role}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          console.log('Using real backend API for demo login');
          const authData: AuthResponse = await response.json();
          return this.handleAuthResponse(authData);
        } else {
          console.log('Backend API not available, falling back to client-side demo');
        }
      } catch (apiError) {
        console.log('Backend API not reachable, using client-side demo:', apiError);
      }

      // Fallback to client-side demo authentication
      const mockAuthData: AuthResponse = {
        access_token: `demo_token_${role}_${Date.now()}`,
        token_type: 'Bearer',
        principal_id: `demo-principal-${role}-${Math.random().toString(36).substr(2, 8)}`,
        role: role,
        user_info: {
          name: this.generateDemoName(role),
          title: this.generateDemoTitle(role),
          permissions: this.generateDemoPermissions(role),
          authenticated_at: new Date().toISOString(),
          demo_mode: true
        },
        expires_in: 3600,
        demo_mode: true
      };

      return this.handleAuthResponse(mockAuthData);
    } catch (error) {
      console.error('Demo login failed:', error);
      throw error;
    }
  }

  private generateDemoName(role: string): string {
    const names = {
      main_government: 'Rajesh Kumar (Admin)',
      state_head: 'Dr. Priya Sharma',
      deputy: 'Amit Singh',
      vendor: 'BuildCorp Industries',
      sub_supplier: 'Materials Plus Ltd',
      citizen: 'Rahul Verma'
    };
    return names[role as keyof typeof names] || 'Demo User';
  }

  private generateDemoTitle(role: string): string {
    const titles = {
      main_government: 'Secretary, Ministry of Finance',
      state_head: 'Chief Secretary, Uttar Pradesh',
      deputy: 'District Collector, Lucknow',
      vendor: 'Project Manager',
      sub_supplier: 'Supply Chain Head',
      citizen: 'Software Engineer'
    };
    return titles[role as keyof typeof titles] || 'Demo Role';
  }

  private generateDemoPermissions(role: string): string[] {
    const permissions = {
      main_government: ['budget_control', 'role_management', 'fraud_oversight', 'system_administration'],
      state_head: ['budget_allocation', 'deputy_management', 'regional_oversight'],
      deputy: ['vendor_selection', 'project_management', 'claim_review'],
      vendor: ['claim_submission', 'payment_tracking', 'supplier_management'],
      sub_supplier: ['delivery_submission', 'quality_assurance', 'vendor_coordination'],
      citizen: ['transparency_access', 'corruption_reporting', 'community_verification']
    };
    return permissions[role as keyof typeof permissions] || ['basic_access'];
  }

  private async handleInternetIdentityAuth(identity: Identity): Promise<User> {
    try {
      const principal = identity.getPrincipal().toString();
      
      // Get delegation signature (simplified for demo)
      const signature = 'ii_delegation_signature'; // TODO: Extract real signature
      
      const response = await fetch(`${API_BASE_URL}/auth/login/internet-identity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          principal_id: principal,
          signature: signature
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const authData: AuthResponse = await response.json();
      return this.handleAuthResponse(authData);
    } catch (error) {
      console.error('Internet Identity authentication failed:', error);
      throw error;
    }
  }

  private handleAuthResponse(authData: AuthResponse): User {
  console.log('Handling auth response:', authData);
  this.token = authData.access_token;
  
  // Generate a display name based on role if not provided
  const generateName = (role: string): string => {
    const roleNames = {
      main_government: 'Government Admin',
      state_head: 'State Head',
      deputy: 'Deputy Officer',
      vendor: 'Vendor User',
      sub_supplier: 'Sub-Supplier User',
      citizen: 'Citizen User'
    };
    return roleNames[role as keyof typeof roleNames] || 'System User';
  };
  
  this.user = {
    principal_id: authData.principal_id,
    role: authData.role as User['role'],
    name: authData.user_info.name || generateName(authData.role), // ADD THIS LINE
    title: authData.user_info.title || authData.role.replace('_', ' '),
    permissions: authData.user_info.permissions || [],
    authenticated_at: authData.user_info.authenticated_at || new Date().toISOString(),
    user_info: authData.user_info
  };

  console.log('Created user object:', this.user);

  // Store in localStorage
  localStorage.setItem('auth_token', this.token);
  localStorage.setItem('auth_user', JSON.stringify(this.user));

  // Setup automatic token refresh (but not for demo mode)
  if (!authData.demo_mode) {
    this.setupTokenRefresh();
  }

  console.log('Auth response handled successfully');
  return this.user;
}
  async logout(): Promise<void> {
    try {
      // Call backend logout if we have a token
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          }
        });
      }

      // Logout from Internet Identity
      if (this.authClient) {
        await this.authClient.logout();
      }

      // Clear local state
      this.clearAuthState();
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state anyway
      this.clearAuthState();
    }
  }

  private clearAuthState(): void {
    this.user = null;
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async refreshToken(): Promise<void> {
    if (!this.token) {
      throw new Error('No token to refresh');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const authData: AuthResponse = await response.json();
      this.handleAuthResponse(authData);

      // Check if role changed
      if (authData.role !== this.user?.role) {
        console.log('User role changed, reloading application');
        window.location.reload();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  private setupTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh token every 23 hours (1 hour before expiry)
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
      }
    }, 23 * 60 * 60 * 1000);
  }

  async getUserProfile(): Promise<User> {
  if (!this.token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const profile = await response.json();
    
    // Check if user exists before updating
    if (!this.user) {
      throw new Error('No user session found');
    }
    
    // Update local user data safely
    this.user = { ...this.user, ...profile };
    localStorage.setItem('auth_user', JSON.stringify(this.user));

    return this.user;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    throw error;
  }
}

  // API helper method that automatically includes auth headers
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Handle token expiry
    if (response.status === 401) {
      try {
        await this.refreshToken();
        // Retry the request with new token
        return this.apiCall(endpoint, options);
      } catch (refreshError) {
        await this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }

  // Role checking utilities
  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  hasPermission(permission: string): boolean {
    return this.user?.permissions.includes(permission) || false;
  }

  isMainGovernment(): boolean {
    return this.hasRole('main_government');
  }

  isStateHead(): boolean {
    return this.hasRole('state_head');
  }

  isDeputy(): boolean {
    return this.hasRole('deputy');
  }

  isVendor(): boolean {
    return this.hasRole('vendor');
  }

  isCitizen(): boolean {
    return this.hasRole('citizen');
  }

  isGovernmentOfficial(): boolean {
    return ['main_government', 'state_head', 'deputy'].includes(this.user?.role || '');
  }

  // Getters
  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.token !== null;
  }

  getPrincipalId(): string | null {
    return this.user?.principal_id || null;
  }

  getRole(): string | null {
    return this.user?.role || null;
  }

  getRoleDisplayName(): string {
    if (!this.user) return 'Guest';
    
    const roleNames = {
      main_government: 'Main Government',
      state_head: 'State Head',
      deputy: 'Deputy',
      vendor: 'Vendor',
      sub_supplier: 'Sub-Supplier',
      citizen: 'Citizen'
    };
    
    return roleNames[this.user.role] || this.user.role;
  }

  // Role-specific utilities
  canManageBudgets(): boolean {
    return this.hasPermission('budget_control');
  }

  canAllocateBudgets(): boolean {
    return this.hasPermission('budget_allocation');
  }

  canSubmitClaims(): boolean {
    return this.hasPermission('claim_submission');
  }

  canReportCorruption(): boolean {
    return this.hasPermission('corruption_reporting');
  }

  canOverseeRegion(): boolean {
    return this.hasPermission('regional_oversight');
  }
}

// Singleton instance
export const authService = new AuthService();
