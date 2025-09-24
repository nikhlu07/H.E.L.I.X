// Internet Identity Authentication Service
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export interface User {
  principal: Principal;
  role: string;
  name: string;
  isAuthenticated: boolean;
  accessToken?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  principal_id: string;
  role: string;
  user_info: {
    name: string;
    title: string;
    permissions: string[];
    authenticated_at: string;
    demo_mode: boolean;
  };
  expires_in: number;
  demo_mode: boolean;
}

// Role mapping based on principal IDs (you can customize this)
const PRINCIPAL_ROLE_MAP: Record<string, string> = {
  // Add specific principal IDs and their roles here
  // For demo, we'll determine roles based on principal patterns
};

// Backend API configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

class AuthService {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;
  private user: User | null = null;
  private accessToken: string | null = null;

  async init(): Promise<void> {
    this.authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });

    // Check if user is already authenticated
    if (await this.authClient.isAuthenticated()) {
      await this.handleAuthenticated();
    }
  }

  async login(): Promise<User> {
    if (!this.authClient) {
      throw new Error('AuthClient not initialized');
    }

    return new Promise((resolve, reject) => {
      // Use MAINNET Internet Identity for real authentication
      const iiUrl = import.meta.env.VITE_II_URL || 'https://identity.ic0.app';

      this.authClient!.login({
        identityProvider: iiUrl,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          try {
            const user = await this.handleAuthenticated();
            resolve(user);
          } catch (error) {
            reject(error);
          }
        },
        onError: (error) => {
          console.error('Internet Identity login failed:', error);
          reject(new Error('Login failed'));
        },
        // Open in popup instead of redirect for better UX
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
      });
    });
  }

  async demoLogin(role: string): Promise<User> {
    try {
      console.log(`Attempting demo login for role: ${role}`);

      // Try backend first, but don't fail if it's not available
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/demo-login/${role}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          console.log('Using real backend API for demo login');
          const authData: AuthResponse = await response.json();

          // Create a mock principal for demo users
          const mockPrincipal = Principal.fromText(`demo-${role}-${Date.now()}`);

          this.accessToken = authData.access_token;

          this.user = {
            principal: mockPrincipal,
            role: authData.role,
            name: authData.user_info.name,
            isAuthenticated: true,
            accessToken: authData.access_token,
          };

          // Store token in localStorage for demo mode
          localStorage.setItem('demo_access_token', authData.access_token);
          localStorage.setItem('demo_user_role', role);

          console.log('✅ Demo login successful:', this.user);
          return this.user;
        }
      } catch (apiError) {
        console.log('Backend API not available, using client-side demo');
      }

      // Fallback to client-side demo authentication
      return this.handleClientSideDemoLogin(role);
    } catch (error) {
      console.warn('Demo login failed, using client-side fallback:', error);
      return this.handleClientSideDemoLogin(role);
    }
  }

  async simpleIILogin(role: string): Promise<User> {
    try {
      console.log(`🔐 Simple Internet Identity Demo for role: ${role}`);

      // Create a mock principal for demo purposes
      const mockPrincipal = Principal.fromText(`demo-ii-${role}-${Date.now()}`);

      // Generate demo user based on role
      const roleData = {
        main_government: { name: 'Government Official', title: 'National Director' },
        state_head: { name: 'State Head', title: 'Regional Manager' },
        deputy: { name: 'Deputy Officer', title: 'District Officer' },
        vendor: { name: 'Vendor Manager', title: 'Contract Manager' },
        citizen: { name: 'Citizen User', title: 'Community Observer' }
      };

      const userRole = role as keyof typeof roleData;
      const userData = roleData[userRole] || roleData.citizen;

      this.accessToken = `simple_ii_${role}_${Date.now()}`;

      this.user = {
        principal: mockPrincipal,
        role: role,
        name: userData.name,
        isAuthenticated: true,
        accessToken: this.accessToken,
      };

      console.log('✅ Simple Internet Identity demo successful:', this.user);
      return this.user;
    } catch (error) {
      console.error('Simple II demo failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
    }

    // Clear demo tokens
    localStorage.removeItem('demo_access_token');
    localStorage.removeItem('demo_user_role');

    this.user = null;
    this.agent = null;
    this.accessToken = null;
  }

  private async handleAuthenticated(): Promise<User> {
    if (!this.authClient) {
      throw new Error('AuthClient not initialized');
    }

    const identity = this.authClient.getIdentity();
    const principal = identity.getPrincipal();

    // Create agent with the authenticated identity - use MAINNET for production
    // Always use mainnet for real Internet Identity authentication
    this.agent = new HttpAgent({
      identity,
      host: 'https://ic0.app', // Use mainnet, not localhost
    });

    // Note: No need to fetch root key for mainnet - it's already available

    // Authenticate with backend using Internet Identity
    try {
      // For real Internet Identity, try backend first
      if (import.meta.env.PROD || !import.meta.env.DEV) {
        console.log('🔐 Production mode: Using real Internet Identity authentication');
        const authData = await this.authenticateWithBackend(principal);
        this.accessToken = authData.access_token;

        this.user = {
          principal,
          role: authData.role,
          name: authData.user_info.name,
          isAuthenticated: true,
          accessToken: authData.access_token,
        };

        console.log('✅ User authenticated with backend:', this.user);
        return this.user;
      } else {
        // In development, use client-side authentication
        console.log('🔧 Development mode: Using client-side Internet Identity authentication');
        return this.handleClientSideInternetIdentityAuth(principal);
      }
    } catch (error) {
      console.warn('Backend authentication failed, using client-side fallback:', error);
      return this.handleClientSideInternetIdentityAuth(principal);
    }
  }

  private async authenticateWithBackend(principal: Principal): Promise<AuthResponse> {
    // Get the delegation chain from the identity
    const identity = this.authClient!.getIdentity();
    const delegationChain = 'getDelegation' in identity ? (identity as any).getDelegation() : null;

    // Prepare the authentication request
    const authRequest = {
      principal_id: principal.toString(),
      delegation_chain: delegationChain,
      domain: window.location.origin,
    };

    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login/internet-identity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend authentication failed: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  private handleClientSideInternetIdentityAuth(principal: Principal): User {
    // Generate demo user based on principal for development
    const demoRole = this.getDemoRoleFromPrincipal(principal.toString());

    this.accessToken = `ii_dev_${principal.toString()}_${Date.now()}`;

    this.user = {
      principal,
      role: demoRole.role,
      name: demoRole.name,
      isAuthenticated: true,
      accessToken: this.accessToken,
    };

    console.log('✅ Client-side Internet Identity authentication successful (Development Mode)');
    return this.user;
  }

  private getDemoRoleFromPrincipal(principal: string): {
    role: string;
    name: string;
  } {
    // Simple role assignment based on principal ID for demo
    const roles = ['main_government', 'vendor', 'citizen', 'state_head', 'deputy'];
    const hash = principal.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const roleIndex = hash % roles.length;
    const role = roles[roleIndex];

    const roleData = {
      main_government: { name: 'Government Official' },
      state_head: { name: 'State Head' },
      deputy: { name: 'Deputy Officer' },
      vendor: { name: 'Vendor Manager' },
      citizen: { name: 'Citizen User' }
    };

    return {
      role,
      name: roleData[role as keyof typeof roleData]?.name || 'Demo User'
    };
  }

  private getRoleName(role: string): string {
    switch (role) {
      case 'main_government': return 'Government Official';
      case 'state_head': return 'State Head';
      case 'deputy': return 'Deputy Officer';
      case 'vendor': return 'Vendor/Contractor';
      case 'sub_supplier': return 'Sub-Supplier';
      case 'citizen': return 'Citizen Observer';
      default: return 'User';
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user?.isAuthenticated || false;
  }

  getAgent(): HttpAgent | null {
    return this.agent;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Check if we have a stored demo token
  hasStoredDemoToken(): boolean {
    return !!(localStorage.getItem('demo_access_token') && localStorage.getItem('demo_user_role'));
  }

  // Restore demo session from stored tokens
  async restoreDemoSession(): Promise<User | null> {
    const token = localStorage.getItem('demo_access_token');
    const role = localStorage.getItem('demo_user_role');

    if (token && role) {
      try {
        // In development mode, skip backend verification
        if (import.meta.env.DEV) {
          const mockPrincipal = Principal.fromText(`demo-${role}-restored`);
          this.accessToken = token;
          this.user = {
            principal: mockPrincipal,
            role: role,
            name: this.getRoleName(role),
            isAuthenticated: true,
            accessToken: token,
          };
          return this.user;
        }

        // Verify token is still valid by making a test request
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const mockPrincipal = Principal.fromText(`demo-${role}-restored`);
          this.accessToken = token;
          this.user = {
            principal: mockPrincipal,
            role: role,
            name: this.getRoleName(role),
            isAuthenticated: true,
            accessToken: token,
          };
          return this.user;
        }
      } catch (error) {
        console.warn('Failed to restore demo session:', error);
      }

      // Clear invalid tokens
      localStorage.removeItem('demo_access_token');
      localStorage.removeItem('demo_user_role');
    }

    return null;
  }

  // Add a principal to role mapping (for admin use)
  addPrincipalRole(principalId: string, role: string): void {
    PRINCIPAL_ROLE_MAP[principalId] = role;
  }

  // Get all role mappings (for admin use)
  getRoleMappings(): Record<string, string> {
    return { ...PRINCIPAL_ROLE_MAP };
  }
}

// Export the class and singleton instance
export { AuthService };
export const authService = new AuthService();
export default authService;