import { UniversalRole } from '../types';

// Regional role mappings
export const regionalRoleMappings: Record<string, Record<UniversalRole, string>> = {
  india: {
    national_authority: 'Central Ministry Official',
    regional_administrator: 'State Government Secretary',
    district_coordinator: 'District Collector',
    implementation_partner: 'Implementation Agency Head',
    community_representative: 'Panchayat Sarpanch',
    public_oversight: 'RTI Activist'
  },
  usa: {
    national_authority: 'Federal Department Head',
    regional_administrator: 'State Administrator',
    district_coordinator: 'County Administrator',
    implementation_partner: 'Contractor Representative',
    community_representative: 'City Council Member',
    public_oversight: 'Citizen Watchdog'
  },
  uk: {
    national_authority: 'Government Department Secretary',
    regional_administrator: 'Devolved Authority Director',
    district_coordinator: 'Local Authority Chief Executive',
    implementation_partner: 'Service Provider Manager',
    community_representative: 'Parish Councillor',
    public_oversight: 'Public Accountability Advocate'
  }
};

// Default region mapping for fallback
export const defaultRoleMappings: Record<UniversalRole, string> = {
  national_authority: 'National Authority Official',
  regional_administrator: 'Regional Administrator',
  district_coordinator: 'District Coordinator',
  implementation_partner: 'Implementation Partner',
  community_representative: 'Community Representative',
  public_oversight: 'Public Oversight'
};

// Get the current region (simplified - in real app this would come from config or geolocation)
export function getCurrentRegion(): string {
  // Default to 'india' for this implementation
  // In a real application, this would detect user's location or use app configuration
  return 'india';
}

// Get localized role name for a universal role
export function getLocalRoleName(universalRole: UniversalRole): string {
  const region = getCurrentRegion();
  const regionalMapping = regionalRoleMappings[region];
  
  if (regionalMapping && regionalMapping[universalRole]) {
    return regionalMapping[universalRole];
  }
  
  // Fallback to default mapping
  return defaultRoleMappings[universalRole];
}

// Role mapper object with methods
export const roleMapper = {
  getCurrentRegion,
  getLocalRoleName
};

// Export default for convenience
export default roleMapper;