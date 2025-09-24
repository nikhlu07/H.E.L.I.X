import { AuthClient } from '@dfinity/auth-client';

// Simple demo user for Internet Identity
export interface SimpleUser {
  principal_id: string;
  role: 'main_government' | 'state_head' | 'deputy' | 'vendor' | 'sub_supplier' | 'citizen';
  name: string;
  title: string;
  permissions: string[];
  authenticated_at: string;
}

class SimpleInternetIdentity {
  private authClient: AuthClient | null = null;
  private user: SimpleUser | null = null;
  private token: string | null = null;

  async init(): Promise<void> {
    try {
      console.log('🔧 Initializing Internet Identity...');
      this.authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true
        }
      });
      console.log('✅ Internet Identity ready!');
    } catch (error) {
      console.error('❌ Failed to initialize Internet Identity:', error);
      throw error;
    }
  }

  async login(): Promise<SimpleUser> {
    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: 'https://identity.ic0.app',
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          try {
            const user = await this.handleLoginSuccess();
            resolve(user);
          } catch (error) {
            reject(error);
          }
        },
        onError: (error) => {
          console.error('❌ Internet Identity login failed:', error);
          reject(new Error('Login failed'));
        }
      });
    });
  }

  private async handleLoginSuccess(): Promise<SimpleUser> {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    const identity = this.authClient.getIdentity();
    const principalId = identity.getPrincipal().toString();

    console.log('🆔 Logged in with principal:', principalId);

    // Generate demo user based on principal (for demo purposes)
    const demoRole = this.getDemoRoleFromPrincipal(principalId);
    const user: SimpleUser = {
      principal_id: principalId,
      role: demoRole.role,
      name: demoRole.name,
      title: demoRole.title,
      permissions: demoRole.permissions,
      authenticated_at: new Date().toISOString()
    };

    // Generate simple token
    this.token = `ii_${principalId}_${Date.now()}`;
    this.user = user;

    // Store in localStorage
    localStorage.setItem('ii_user', JSON.stringify(user));
    localStorage.setItem('ii_token', this.token);

    console.log('✅ Internet Identity login successful!');
    return user;
  }

  private getDemoRoleFromPrincipal(principalId: string): {
    role: SimpleUser['role'];
    name: string;
    title: string;
    permissions: string[];
  } {
    // Simple role assignment based on principal ID for demo
    const roles: SimpleUser['role'][] = ['main_government', 'vendor', 'citizen', 'state_head', 'deputy'];
    const hash = principalId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
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

  async logout(): Promise<void> {
    try {
      if (this.authClient) {
        await this.authClient.logout();
      }

      this.user = null;
      this.token = null;
      localStorage.removeItem('ii_user');
      localStorage.removeItem('ii_token');

      console.log('✅ Internet Identity logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!(this.user && this.token);
  }

  getUser(): SimpleUser | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  getPrincipalId(): string | null {
    return this.user?.principal_id || null;
  }

  getRole(): string | null {
    return this.user?.role || null;
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  hasPermission(permission: string): boolean {
    return this.user?.permissions.includes(permission) ?? false;
  }
}

export const internetIdentity = new SimpleInternetIdentity();
export default internetIdentity;

export type User = SimpleUser;
