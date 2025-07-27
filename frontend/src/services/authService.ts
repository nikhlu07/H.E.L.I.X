// Internet Identity Authentication Service
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export interface User {
  principal: Principal;
  role: string;
  name: string;
  isAuthenticated: boolean;
}

// Role mapping based on principal IDs (you can customize this)
const PRINCIPAL_ROLE_MAP: Record<string, string> = {
  // Add specific principal IDs and their roles here
  // For demo, we'll determine roles based on principal patterns
};

// Internet Identity provider URL - use mainnet for now since we don't have local dfx
const II_URL = 'https://identity.ic0.app';

class AuthService {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;
  private user: User | null = null;

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

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.user = null;
      this.agent = null;
    }
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

    // Determine user role
    const principalString = principal.toString();
    console.log('🔐 Principal ID:', principalString);
    
    const role = this.determineUserRole(principalString);
    const name = this.getRoleName(role);

    console.log('👤 Assigned role:', role, 'Name:', name);

    this.user = {
      principal,
      role,
      name,
      isAuthenticated: true,
    };

    console.log('✅ User authenticated:', this.user);
    return this.user;
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

  // Add a principal to role mapping (for admin use)
  addPrincipalRole(principalId: string, role: string): void {
    PRINCIPAL_ROLE_MAP[principalId] = role;
  }

  // Get all role mappings (for admin use)
  getRoleMappings(): Record<string, string> {
    return { ...PRINCIPAL_ROLE_MAP };
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;