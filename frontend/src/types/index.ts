export type UniversalRole = 
  | 'national_authority'
  | 'regional_administrator'
  | 'district_coordinator'
  | 'implementation_partner'
  | 'community_representative'
  | 'public_oversight';

export interface RolePermission {
  name: string;
  description: string;
  scope: 'read' | 'write' | 'admin';
}

export interface User {
  principal: string;
  role: UniversalRole;
  name: string;
  title?: string;
  permissions: string[];
  isAuthenticated: boolean;
  accessToken?: string;
  authenticated_at?: string;
}