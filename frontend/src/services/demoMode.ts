// Universal Role-Based Demo Mode Service
import { Principal } from '@dfinity/principal';
import { UniversalRole } from '../types';
import { roleMapper, getLocalRoleName } from './roleMapper';
import { UniversalRoleValidator } from './universalRoles';

export interface DemoUser {
  principal: Principal;
  universalRole: UniversalRole;
  localRoleName: string;
  name: string;
  isAuthenticated: boolean;
  accessToken?: string;
  permissions: string[];
  region: string;
}

// Universal role configurations that work across all regions
const universalDemoUsers: Record<UniversalRole, {
  nameTemplate: string;
  getLocalizedName: (region: string) => string;
}> = {
  'national_authority': {
    nameTemplate: 'National Authority Official',
    getLocalizedName: (region: string) => {
      const regionNames = {
        india: 'Central Ministry Official',
        usa: 'Federal Department Head',
        uk: 'Government Department Secretary'
      };
      return regionNames[region as keyof typeof regionNames] || 'National Authority Official';
    }
  },
  'regional_administrator': {
    nameTemplate: 'Regional Administrator',
    getLocalizedName: (region: string) => {
      const regionNames = {
        india: 'State Government Secretary',
        usa: 'State Administrator',
        uk: 'Devolved Authority Director'
      };
      return regionNames[region as keyof typeof regionNames] || 'Regional Administrator';
    }
  },
  'district_coordinator': {
    nameTemplate: 'District Coordinator',
    getLocalizedName: (region: string) => {
      const regionNames = {
        india: 'District Collector',
        usa: 'County Administrator',
        uk: 'Local Authority Chief Executive'
      };
      return regionNames[region as keyof typeof regionNames] || 'District Coordinator';
    }
  },
  'implementation_partner': {
    nameTemplate: 'Implementation Partner',
    getLocalizedName: (region: string) => {
      const regionNames = {
        india: 'Implementation Agency Head',
        usa: 'Contractor Representative',
        uk: 'Service Provider Manager'
      };
      return regionNames[region as keyof typeof regionNames] || 'Implementation Partner';
    }
  },
  'community_representative': {
    nameTemplate: 'Community Representative',
    getLocalizedName: (region: string) => {
      const regionNames = {
        india: 'Panchayat Sarpanch',
        usa: 'City Council Member',
        uk: 'Parish Councillor'
      };
      return regionNames[region as keyof typeof regionNames] || 'Community Representative';
    }
  },
  'public_oversight': {
    nameTemplate: 'Public Oversight',
    getLocalizedName: (region: string) => {
      const regionNames = {
        india: 'RTI Activist',
        usa: 'Citizen Watchdog',
        uk: 'Public Accountability Advocate'
      };
      return regionNames[region as keyof typeof regionNames] || 'Public Oversight';
    }
  }
};

class DemoModeService {
  private currentUser: DemoUser | null = null;

  async loginWithDemo(universalRole: UniversalRole): Promise<DemoUser> {
    // Validate universal role
    if (!UniversalRoleValidator.isValidUniversalRole(universalRole)) {
      throw new Error(`Invalid universal role: ${universalRole}`);
    }

    const userConfig = universalDemoUsers[universalRole];
    if (!userConfig) {
      throw new Error(`Demo configuration not found for role: ${universalRole}`);
    }

    // Get current region and localized role information
    const currentRegion = roleMapper.getCurrentRegion();
    const localRoleName = getLocalRoleName(universalRole);
    const localizedName = userConfig.getLocalizedName(currentRegion);
    
    // Get permissions for this role
    const permissions = UniversalRoleValidator.getRolePermissions(universalRole);
    const permissionNames = permissions.map(p => p.name);

    // Create mock principal - use a valid principal format
    const mockPrincipal = Principal.fromText('2vxsx-fae');
    
    // Create demo user with universal role system
    this.currentUser = {
      principal: mockPrincipal,
      universalRole,
      localRoleName,
      name: localizedName,
      isAuthenticated: true,
      accessToken: `demo-token-${universalRole}-${Date.now()}`,
      permissions: permissionNames,
      region: currentRegion
    };

    // Store in localStorage for persistence
    localStorage.setItem('demo_user', JSON.stringify({
      ...this.currentUser,
      principal: this.currentUser.principal.toString() // Store principal as string
    }));
    localStorage.setItem('demo_user_universal_role', universalRole);
    localStorage.setItem('demo_user_region', currentRegion);

    console.log('✅ Universal demo login successful:', {
      universalRole,
      localRoleName,
      name: localizedName,
      region: currentRegion,
      permissions: permissionNames.length
    });
    
    return this.currentUser;
  }

  async getCurrentUser(): Promise<DemoUser | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('demo_user');
    const storedRole = localStorage.getItem('demo_user_universal_role');
    const storedRegion = localStorage.getItem('demo_user_region');
    
    if (storedUser && storedRole) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Restore principal from string
        const principal = Principal.fromText(userData.principal);
        
        // Verify the role is still valid and update localized information
        if (UniversalRoleValidator.isValidUniversalRole(storedRole as UniversalRole)) {
          const universalRole = storedRole as UniversalRole;
          const currentRegion = roleMapper.getCurrentRegion();
          
          // Update localized information in case region changed
          const localRoleName = getLocalRoleName(universalRole);
          const userConfig = universalDemoUsers[universalRole];
          const localizedName = userConfig.getLocalizedName(currentRegion);
          const permissions = UniversalRoleValidator.getRolePermissions(universalRole);
          
          this.currentUser = {
            ...userData,
            principal,
            universalRole,
            localRoleName,
            name: localizedName,
            permissions: permissions.map(p => p.name),
            region: currentRegion
          };
          
          return this.currentUser;
        }
      } catch (error) {
        console.error('Failed to restore demo user:', error);
        this.clearStoredUser();
      }
    }

    return null;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.clearStoredUser();
    console.log('✅ Universal demo logout successful');
  }

  private clearStoredUser(): void {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_user_universal_role');
    localStorage.removeItem('demo_user_region');
    // Legacy cleanup
    localStorage.removeItem('demo_user_role');
  }

  isAuthenticated(): boolean {
    return this.currentUser?.isAuthenticated || false;
  }

  getAccessToken(): string | null {
    return this.currentUser?.accessToken || null;
  }

  getUserRole(): string | null {
    return this.currentUser?.localRoleName || null;
  }

  getUniversalRole(): UniversalRole | null {
    return this.currentUser?.universalRole || null;
  }

  getUserPermissions(): string[] {
    return this.currentUser?.permissions || [];
  }

  getUserRegion(): string | null {
    return this.currentUser?.region || null;
  }

  hasPermission(permissionName: string): boolean {
    return this.getUserPermissions().includes(permissionName);
  }

  // Method to update user when region changes
  async updateUserForRegion(newRegion: string): Promise<DemoUser | null> {
    if (!this.currentUser) {
      return null;
    }

    const universalRole = this.currentUser.universalRole;
    const userConfig = universalDemoUsers[universalRole];
    const localRoleName = getLocalRoleName(universalRole);
    const localizedName = userConfig.getLocalizedName(newRegion);

    // Update current user with new region information
    this.currentUser = {
      ...this.currentUser,
      localRoleName,
      name: localizedName,
      region: newRegion
    };

    // Update localStorage
    localStorage.setItem('demo_user', JSON.stringify({
      ...this.currentUser,
      principal: this.currentUser.principal.toString()
    }));
    localStorage.setItem('demo_user_region', newRegion);

    console.log('✅ Updated demo user for new region:', {
      universalRole,
      localRoleName,
      name: localizedName,
      region: newRegion
    });

    return this.currentUser;
  }

  // Get available roles for current region
  getAvailableRoles(): Array<{
    universalRole: UniversalRole;
    localName: string;
    displayName: string;
  }> {
    const currentRegion = roleMapper.getCurrentRegion();
    
    return Object.keys(universalDemoUsers).map(role => {
      const universalRole = role as UniversalRole;
      const userConfig = universalDemoUsers[universalRole];
      const localName = getLocalRoleName(universalRole);
      const displayName = userConfig.getLocalizedName(currentRegion);
      
      return {
        universalRole,
        localName,
        displayName
      };
    });
  }
}

export const demoModeService = new DemoModeService();
export default demoModeService;
