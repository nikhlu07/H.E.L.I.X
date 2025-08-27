// Simple Demo Mode Service - Works without backend
import { Principal } from '@dfinity/principal';

export interface DemoUser {
  principal: Principal;
  role: string;
  name: string;
  isAuthenticated: boolean;
  accessToken?: string;
}

const demoUsers = {
  'main_government': {
    name: 'Government Official',
    role: 'main_government',
    permissions: ['Budget Control', 'Role Management', 'Fraud Oversight', 'System Administration']
  },
  'state_head': {
    name: 'State Head',
    role: 'state_head',
    permissions: ['Regional Management', 'Budget Oversight', 'Project Approval', 'Vendor Management']
  },
  'deputy': {
    name: 'Deputy Officer',
    role: 'deputy',
    permissions: ['Project Management', 'Vendor Approval', 'Claim Processing', 'Local Oversight']
  },
  'vendor': {
    name: 'Vendor/Contractor',
    role: 'vendor',
    permissions: ['Claim Submission', 'Payment Tracking', 'Supplier Management', 'Contract Compliance']
  },
  'sub_supplier': {
    name: 'Sub-Supplier',
    role: 'sub_supplier',
    permissions: ['Subcontract Management', 'Material Supply', 'Invoice Submission', 'Quality Control']
  },
  'citizen': {
    name: 'Citizen Observer',
    role: 'citizen',
    permissions: ['Transparency Access', 'Corruption Reporting', 'Community Verification', 'Public Auditing']
  }
};

class DemoModeService {
  private currentUser: DemoUser | null = null;

  async loginWithDemo(role: string): Promise<DemoUser> {
    const userConfig = demoUsers[role as keyof typeof demoUsers];
    
    if (!userConfig) {
      throw new Error(`Invalid role: ${role}`);
    }

    // Create mock principal - use a valid principal format
    const mockPrincipal = Principal.fromText('2vxsx-fae');
    
    // Create demo user
    this.currentUser = {
      principal: mockPrincipal,
      role: userConfig.role,
      name: userConfig.name,
      isAuthenticated: true,
      accessToken: `demo-token-${role}-${Date.now()}`
    };

    // Store in localStorage for persistence
    localStorage.setItem('demo_user', JSON.stringify(this.currentUser));
    localStorage.setItem('demo_user_role', role);

    console.log('✅ Demo login successful:', this.currentUser);
    return this.currentUser;
  }

  async getCurrentUser(): Promise<DemoUser | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.currentUser = {
          ...userData,
          principal: Principal.fromText('2vxsx-fae')
        };
        return this.currentUser;
      } catch (error) {
        console.error('Failed to restore demo user:', error);
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_user_role');
      }
    }

    return null;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_user_role');
    console.log('✅ Demo logout successful');
  }

  isAuthenticated(): boolean {
    return this.currentUser?.isAuthenticated || false;
  }

  getAccessToken(): string | null {
    return this.currentUser?.accessToken || null;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }
}

export const demoModeService = new DemoModeService();
export default demoModeService;
