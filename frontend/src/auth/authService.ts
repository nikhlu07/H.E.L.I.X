// frontend/src/auth/authService.ts - NEW
import { AuthClient } from '@dfinity/auth-client';
import { Identity, HttpAgent } from '@dfinity/agent';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api/v1' : 'http://localhost:8000/api/v1');

export interface User {
  principal_id: string;
  role: 'main_government' | 'state_head' | 'deputy' | 'vendor' | 'sub_supplier' | 'citizen';
  name: string;
  title: string;
  permissions: string[];
  authenticated_at: string;
  user_info?: Record<string, unknown>;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  principal_id: string;
  role: string;
  user_info: Record<string, unknown>;
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
          // Setup token refresh timer
          if (this.refreshTimer) clearInterval(this.refreshTimer);
          this.refreshTimer = setInterval(() => {
            this.refreshToken().catch(console.error);
          }, 3600000); // Refresh token every hour
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
      // Use local development URL for Internet Identity in development mode
      const iiUrl = import.meta.env.VITE_II_URL ||
        'https://identity.ic0.app';

      this.authClient!.login({
        identityProvider: iiUrl,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
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

      // In development mode, skip backend call and use client-side demo
      if (import.meta.env.DEV) {
        console.log('🔧 Development mode: Using client-side Internet Identity authentication');
        return this.handleClientSideInternetIdentityAuth(principal);
      }

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
        console.warn('Backend authentication failed, falling back to client-side auth');
        return this.handleClientSideInternetIdentityAuth(principal);
      }

      const authData: AuthResponse = await response.json();
      return this.handleAuthResponse(authData);
    } catch (error) {
      console.warn('Backend authentication error, using client-side fallback:', error);
      const principal = identity.getPrincipal().toString();
      return this.handleClientSideInternetIdentityAuth(principal);
    }
  }

  private handleClientSideInternetIdentityAuth(principal: string): User {
    // Generate demo user based on principal for development
    const demoRole = this.getDemoRoleFromPrincipal(principal);

    this.user = {
      principal_id: principal,
      role: demoRole.role,
      name: demoRole.name,
      title: demoRole.title,
      permissions: demoRole.permissions,
      authenticated_at: new Date().toISOString(),
      user_info: {
        name: demoRole.name,
        title: demoRole.title,
        permissions: demoRole.permissions,
        authenticated_at: new Date().toISOString(),
        demo_mode: true
      }
    };

    // Generate simple token for development
    this.token = `ii_dev_${principal}_${Date.now()}`;

    // Store in localStorage
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('auth_user', JSON.stringify(this.user));

    console.log('✅ Client-side Internet Identity authentication successful (Development Mode)');
    return this.user;
  }

  private getDemoRoleFromPrincipal(principal: string): {
    role: User['role'];
    name: string;
    title: string;
    permissions: string[];
  } {
    // Simple role assignment based on principal ID for demo
    const roles: User['role'][] = ['main_government', 'vendor', 'citizen', 'state_head', 'deputy'];
    const hash = principal.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const roleIndex = hash % roles.length;
    const role = roles[roleIndex];

    const roleData = {
      main_government: {
        name: 'Government Official',
        title: 'System Administrator',
        permissions: ['budget_control', 'role_management', 'fraud_oversight']
      },
      state_head: {
        name: 'State Head',
        title: 'Regional Director',
        permissions: ['budget_allocation', 'regional_oversight']
      },
      deputy: {
        name: 'Deputy Officer',
        title: 'District Manager',
        permissions: ['vendor_selection', 'project_management']
      },
      vendor: {
        name: 'Vendor Manager',
        title: 'Project Contractor',
        permissions: ['claim_submission', 'payment_tracking']
      },
      sub_supplier: {
        name: 'Sub-Supplier',
        title: 'Supply Chain Manager',
        permissions: ['delivery_submission', 'quality_assurance']
      },
      citizen: {
        name: 'Citizen User',
        title: 'Public User',
        permissions: ['transparency_access', 'corruption_reporting']
      }
    };

    return {
      role,
      ...roleData[role]
    };
  }

  private handleAuthResponse(authData: AuthResponse): User {
  console.log('Handling auth response:', authData);
  this.token = authData.access_token;

  // Generate a display name based on role if not provided
  const generateName = (role: string): string => {
    const roleNames: Record<string, string> = {
      main_government: 'Government Admin',
      state_head: 'State Head',
      deputy: 'Deputy Officer',
      vendor: 'Vendor User',
      sub_supplier: 'Sub-Supplier User',
      citizen: 'Citizen User'
    };
    return roleNames[role as keyof typeof roleNames] || 'System User';
  };

  const userInfo = authData.user_info || {};
  const userPermissions = Array.isArray(userInfo.permissions) ? userInfo.permissions : [];

  this.user = {
    principal_id: authData.principal_id,
    role: authData.role as User['role'],
    name: (userInfo.name as string) || generateName(authData.role),
    title: (userInfo.title as string) || authData.role.replace('_', ' '),
    permissions: userPermissions,
    authenticated_at: (userInfo.authenticated_at as string) || new Date().toISOString(),
    user_info: userInfo
  };

  console.log('Created user object:', this.user);

  // Store in localStorage
  localStorage.setItem('auth_token', this.token);
  localStorage.setItem('auth_user', JSON.stringify(this.user));

  // Setup automatic token refresh (but not for demo mode)
  if (!authData.demo_mode && this.user) {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(() => {
      this.refreshToken().catch(console.error);
    }, 3600000); // Refresh token every hour
  }

  console.log('Auth response handled successfully');
  if (!this.user) {
    throw new Error('Failed to create user object');
  }
  return this.user;
}
  async logout(): Promise<void> {
    try {
      // Call backend logout if we have a token
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          }
        });
      }

      // Logout from Internet Identity
      if (this.authClient) {
        await this.authClient.logout();
      }

      // Clear local state
      // Clear auth state
      this.token = null;
      this.user = null;
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state anyway
      this.token = null;
      this.user = null;
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
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

  async getUserProfile(): Promise<User> {
  if (!this.token) {
    throw new Error('Not authenticated');
  }

  try {
    // Skip backend call - using ICP canister only
    // const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.token}`,
    //     'Content-Type': 'application/json',
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to get user profile');
    // }

    // const profile = await response.json();
    
    // Return current user instead of fetching from backend
    if (!this.user) {
      throw new Error('User is null');
    }
    return this.user;
  } catch (error) {
    // Silently ignore - backend not running
    // console.error('Failed to get user profile:', error);
    throw error;
  }
}

  async _getUserProfileFromBackend(): Promise<User> {
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
    console.error('Failed to get user profile from backend:', error);
    throw error;
  }
}

  // API helper method that automatically includes auth headers
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  hasPermission(permission: string): boolean {
    return this.user?.permissions.includes(permission) ?? false;
  }

  isAuditor(): boolean {
    return this.user?.role === 'auditor';
  }

  isMainGovernment(): boolean {
    return this.user?.role === 'main_government';
  }

  isStateHead(): boolean {
    return this.user?.role === 'state_head';
  }

  isDeputy(): boolean {
    return this.user?.role === 'deputy';
  }

  isVendor(): boolean {
    return this.user?.role === 'vendor';
  }

  isCitizen(): boolean {
    return this.user?.role === 'citizen';
  }

  isGovernmentOfficial(): boolean {
    return ['auditor', 'main_government', 'state_head', 'deputy'].includes(this.user?.role || '');
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getPrincipalId(): string | null {
    return this.user?.principal_id || null;
  }

  getRole(): string | null {
    return this.user?.role || null;
  }

  getRoleDisplayName(): string {
    const roleNames: Record<string, string> = {
      main_government: 'Main Government',
      state_head: 'State Head',
      deputy: 'Deputy',
      vendor: 'Vendor',
      sub_supplier: 'Sub Supplier',
      citizen: 'Citizen',
    };
    return roleNames[this.user?.role || ''] || 'User';
  }

  canManageBudgets(): boolean {
    return this.user?.permissions.includes('budget_control') || false;
  }

  canAllocateBudgets(): boolean {
    return this.user?.permissions.includes('budget_allocation') || false;
  }

  canSubmitClaims(): boolean {
    return this.user?.permissions.includes('claim_submission') || false;
  }

  canReportCorruption(): boolean {
    return this.user?.permissions.includes('corruption_reporting') || false;
  }

  canOverseeRegion(): boolean {
    return this.user?.permissions.includes('regional_oversight') || false;
  }

  // Provide a DFINITY HttpAgent bound to the II identity for signing canister calls
  getAgent(): HttpAgent | null {
    try {
      const identity = this.authClient?.getIdentity();
      if (!identity) return null;
      const host = import.meta.env.VITE_IC_HOST || 'https://ic0.app';
      return new HttpAgent({ host, identity });
    } catch (e) {
      console.error('Failed to create HttpAgent from II identity:', e);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
