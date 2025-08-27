// Internet Identity Authentication Service
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
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

// Internet Identity provider URL - use mainnet for now since we don't have local dfx
const II_URL = 'https://identity.ic0.app';

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
      this.authClient!.login({
        identityProvider: II_URL,
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
      const response = await fetch(`${BACKEND_URL}/auth/demo-login/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Demo login failed: ${response.statusText}`);
      }

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
    } catch (error) {
      console.error('Demo login failed:', error);
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
    
    // Create agent with the authenticated identity - use mainnet
    this.agent = new HttpAgent({
      identity,
      host: 'https://ic0.app',
    });

    // Note: No need to fetch root key for mainnet

    // Authenticate with backend using Internet Identity
    try {
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
    } catch (error) {
      console.error('Backend authentication failed:', error);
      throw new Error('Failed to authenticate with backend system');
    }
  }

  private async authenticateWithBackend(principal: Principal): Promise<AuthResponse> {
    // Get the delegation chain from the identity
    const identity = this.authClient!.getIdentity();
    const delegationChain = await identity.getDelegation();
    
    // Prepare the authentication request
    const authRequest = {
      principal_id: principal.toString(),
      delegation_chain: delegationChain,
      domain: window.location.origin,
    };

    const response = await fetch(`${BACKEND_URL}/auth/ii/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend authentication failed: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  private determineUserRole(principalId: string): string {
    // Check if principal is in the explicit mapping
    if (PRINCIPAL_ROLE_MAP[principalId]) {
      return PRINCIPAL_ROLE_MAP[principalId];
    }

    // For demo purposes, we can determine roles based on principal patterns
    // In production, this would come from your canister's user management system
    
    // You can customize this logic based on your requirements
    if (principalId.includes('gov') || principalId.includes('admin')) {
      return 'main_government';
    } else if (principalId.includes('state')) {
      return 'state_head';
    } else if (principalId.includes('deputy')) {
      return 'deputy';
    } else if (principalId.includes('vendor')) {
      return 'vendor';
    } else if (principalId.includes('supplier')) {
      return 'sub_supplier';
    } else {
      // Default to citizen for any other principals
      return 'citizen';
    }
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
        // Verify token is still valid by making a test request
        const response = await fetch(`${BACKEND_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
        console.error('Failed to restore demo session:', error);
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