/**
 * Auth-related type definitions for Internet Identity integration
 */

import type { AuthClientLoginOptions } from '@dfinity/auth-client';

// User role types
export type UserRole = 'main_government' | 'state_head' | 'deputy' | 'vendor' | 'sub_supplier' | 'citizen';

// User interface
export interface User {
  principal: string;
  role: UserRole;
  name: string;
  permissions: string[];
  user_info?: Record<string, unknown>;
}

// Auth response from backend
export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: string;
  user_info: {
    name?: string;
    permissions?: string[];
    [key: string]: unknown;
  };
  expires_in?: number;
  demo_mode?: boolean;
}

// Session data for localStorage
export interface SessionData {
  token: string;
  sessionId: string;
  user: User;
  demoMode: boolean;
}

// API request options
export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Demo user for development
export interface DemoUser {
  principal_id: string;
  role: UserRole;
  name: string;
  title: string;
  permissions: string[];
  available: boolean;
}

// Delegation chain for Internet Identity
export interface DelegationChain {
  delegation: {
    pubkey: number[];
    expiration: string;
    targets?: string[];
  };
  signature: number[];
}

// Internet Identity delegation identity
export interface IIDelegationIdentity {
  getPrincipal(): { toString(): string };
  _delegation?: {
    delegations: Array<{
      delegation: {
        pubkey: number[] | Uint8Array;
        expiration: bigint;
        targets?: Uint8Array[];
      };
      signature: number[] | Uint8Array;
    }>;
  };
}

// Auth client configuration
export interface AuthClientConfig {
  idleOptions?: {
    idleTimeout: number;
    disableDefaultIdleCallback: boolean;
  };
}

// Login options for Internet Identity
export interface LoginOptions extends AuthClientLoginOptions {
  onSuccess?: () => void | Promise<void>;
  onError?: (error?: string) => void;
}
