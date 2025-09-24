/**
 * CorruptGuard Internet Identity TypeScript Integration
 * Handles authentication with Internet Identity and API communication
 */

import { AuthClient } from "@dfinity/auth-client";
import type {
  User,
  UserRole,
  DelegationChain,
  AuthClientConfig,
  LoginOptions,
  IIDelegationIdentity,
  DemoUser,
  SessionData,
  ApiRequestOptions
} from './types';

// Configuration
interface Config {
  II_URL: string;
  CANISTER_ID: string;
  API_URL: string;
  HOST: string;
}

const CONFIG: Config = {
  // Internet Identity URL (use local for development)
  II_URL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaah-qcaiq-cai'
    : 'https://identity.ic0.app',

  // CorruptGuard canister ID
  CANISTER_ID: process.env.REACT_APP_CANISTER_ID || 'rdmx6-jaaaa-aaaah-qcaiq-cai',

  // Backend API URL
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',

  // Host for local development
  HOST: process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app'
};

type AuthListener = (state: { isAuthenticated: boolean; user: User | null; principal: string | null }) => void;

class InternetIdentityAuth {
  private authClient: AuthClient | null = null;
  private identity: IIDelegationIdentity | null = null;
  private principal: string | null = null;
  private isAuthenticated: boolean = false;
  private userProfile: User | null = null;
  private apiToken: string | null = null;
  private sessionId: string | null = null;
  private authListeners: AuthListener[] = [];

  /**
   * Initialize the authentication client
   */
  async init(): Promise<AuthClient> {
    try {
      console.log('🔧 Initializing Internet Identity auth client...');

      const config: AuthClientConfig = {
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true
        }
      };

      this.authClient = await AuthClient.create(config);

      // Check if user is already authenticated
      const isAuthenticated = await this.authClient.isAuthenticated();

      if (isAuthenticated) {
        await this.handleAuthSuccess();
        console.log('✅ User already authenticated');
      } else {
        console.log('ℹ️ User not authenticated');
      }

      return this.authClient;
    } catch (error) {
      console.error('❌ Failed to initialize auth client:', error);
      throw error;
    }
  }

  /**
   * Login with Internet Identity
   */
  async login(): Promise<User> {
    try {
      console.log('🔐 Starting Internet Identity login...');

      if (!this.authClient) {
        await this.init();
      }

      return new Promise<User>((resolve, reject) => {
        const loginOptions: LoginOptions = {
          identityProvider: CONFIG.II_URL,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
          onSuccess: async () => {
            try {
              await this.handleAuthSuccess();
              if (this.userProfile) {
                resolve(this.userProfile);
              } else {
                reject(new Error('Failed to get user profile after login'));
              }
            } catch (error) {
              reject(error);
            }
          },
          onError: (error?: string) => {
            console.error('❌ Internet Identity login failed:', error);
            reject(new Error(error || 'Login failed'));
          }
        };

        this.authClient!.login(loginOptions);
      });
    } catch (error) {
      console.error('❌ Login initialization failed:', error);
      throw error;
    }
  }

  /**
   * Login with demo credentials (development only)
   */
  async loginDemo(principalId: string, role: UserRole): Promise<User> {
    try {
      console.log('🎭 Demo login as:', role);

      const response = await fetch(`${CONFIG.API_URL}/auth/demo-login/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Demo login failed: ${response.statusText}`);
      }

      const data: AuthResponse = await response.json();

      // Adapt to backend response shape
      this.userProfile = {
        principal: principalId,
        role: data.role as UserRole,
        name: data.user_info?.name || 'Demo User',
        permissions: data.user_info?.permissions || [],
      } as unknown as User;
      this.apiToken = data.access_token;
      this.sessionId = 'demo-session';
      this.isAuthenticated = true;
      this.principal = principalId;

      const sessionData: SessionData = {
        token: this.apiToken,
        sessionId: this.sessionId,
        user: this.userProfile,
        demoMode: true
      };
      localStorage.setItem('corruptguard_auth', JSON.stringify(sessionData));

      this.notifyAuthListeners(true);
      console.log('✅ Demo authentication successful');
      return this.userProfile;
    } catch (error) {
      console.error('❌ Demo login failed:', error);
      throw error;
    }
  }

  private async handleAuthSuccess(): Promise<void> {
    try {
      if (!this.authClient) {
        throw new Error('Auth client not initialized');
      }

      this.identity = this.authClient.getIdentity() as IIDelegationIdentity;
      this.principal = this.identity.getPrincipal().toString();
      console.log('🆔 Principal:', this.principal);

      // Authenticate with backend (II login)
      const response = await fetch(`${CONFIG.API_URL}/auth/login/internet-identity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principal_id: this.principal,
          delegation_chain: await this.getDelegationChain(),
          domain: window.location.origin
        })
      });

      if (!response.ok) {
        throw new Error(`Backend authentication failed: ${response.statusText}`);
      }

      const data: AuthResponse = await response.json();

      this.userProfile = {
        principal: this.principal,
        role: data.role as UserRole,
        name: data.user_info?.name || 'II User',
        permissions: data.user_info?.permissions || [],
      } as unknown as User;
      this.apiToken = data.access_token;
      this.sessionId = 'ii-session';
      this.isAuthenticated = true;

      const sessionData: SessionData = {
        token: this.apiToken,
        sessionId: this.sessionId,
        user: this.userProfile,
        demoMode: false
      };
      localStorage.setItem('corruptguard_auth', JSON.stringify(sessionData));

      this.notifyAuthListeners(true);
      console.log('✅ Backend authentication successful');
    } catch (error) {
      console.error('❌ Auth success handling failed:', error);
      throw error;
    }
  }

  private async getDelegationChain(): Promise<DelegationChain[]> {
    try {
      const identity = this.authClient?.getIdentity() as IIDelegationIdentity;

      // Extract delegation chain from identity
      if (identity._delegation && identity._delegation.delegations) {
        return identity._delegation.delegations.map(delegation => ({
          delegation: {
            pubkey: Array.from(delegation.delegation.pubkey as number[]),
            expiration: delegation.delegation.expiration.toString(),
            targets: delegation.delegation.targets ?
              delegation.delegation.targets.map(t => t.toString()) : undefined
          },
          signature: Array.from(delegation.signature as number[])
        }));
      }

      return [];
    } catch (error) {
      console.error('❌ Failed to get delegation chain:', error);
      return [];
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('👋 Logging out...');

      // Logout from backend
      if (this.apiToken) {
        try {
          await fetch(`${CONFIG.API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiToken}`
            },
            body: JSON.stringify({
              token: this.apiToken,
              session_id: this.sessionId
            })
          });
        } catch (error) {
          console.warn('⚠️ Backend logout failed:', error);
        }
      }

      // Logout from Internet Identity
      if (this.authClient) {
        await this.authClient.logout();
      }

      // Clear local state
      this.clearAuthState();

      // Clear localStorage
      localStorage.removeItem('corruptguard_auth');

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Still clear local state even if logout API fails
      this.clearAuthState();
      localStorage.removeItem('corruptguard_auth');
    }
  }

  private clearAuthState(): void {
    this.identity = null;
    this.principal = null;
    this.isAuthenticated = false;
    this.userProfile = null;
    this.apiToken = null;
    this.sessionId = null;
    this.notifyAuthListeners(false);
  }

  async restoreAuth(): Promise<boolean> {
    try {
      const storedAuth = localStorage.getItem('corruptguard_auth');

      if (storedAuth) {
        const authData: SessionData = JSON.parse(storedAuth);

        // Verify token is still valid
        const isValid = await this.verifyToken(authData.token);

        if (isValid) {
          this.userProfile = authData.user;
          this.apiToken = authData.token;
          this.sessionId = authData.sessionId;
          this.isAuthenticated = true;
          this.principal = authData.user.principal;

          this.notifyAuthListeners(true);
          console.log('✅ Authentication restored from storage');
          return true;
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('corruptguard_auth');
          console.log('⚠️ Stored token invalid, cleared');
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Failed to restore auth:', error);
      localStorage.removeItem('corruptguard_auth');
      return false;
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${CONFIG.API_URL}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        const data: { data?: { valid?: boolean } } = await response.json();
        return !!data.data?.valid;
      }
      return false;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      if (!this.apiToken) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${CONFIG.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify({
          token: this.apiToken
        })
      });

      if (response.ok) {
        const data: { success: boolean; data: { token: string } } = await response.json();

        if (data.success) {
          this.apiToken = data.data.token;

          // Update localStorage
          const storedAuth = localStorage.getItem('corruptguard_auth');
          if (storedAuth) {
            const authData: SessionData = JSON.parse(storedAuth);
            authData.token = this.apiToken;
            localStorage.setItem('corruptguard_auth', JSON.stringify(authData));
          }

          console.log('✅ Token refreshed successfully');
          return true;
        }
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // If refresh fails, logout user
      await this.logout();
      return false;
    }
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.apiToken) {
      return {};
    }

    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'X-Session-ID': this.sessionId || '',
      'X-Principal-ID': this.principal || ''
    };
  }

  async apiRequest(endpoint: string, options: ApiRequestOptions = {}): Promise<Response> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${CONFIG.API_URL}${endpoint}`;

      const requestOptions: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers
        }
      };

      const response = await fetch(url, requestOptions);

      // Handle token expiration
      if (response.status === 401) {
        console.log('🔄 Token expired, attempting refresh...');
        const refreshed = await this.refreshToken();

        if (refreshed) {
          // Retry request with new token
          requestOptions.headers = {
            ...requestOptions.headers,
            ...this.getAuthHeaders()
          };
          return await fetch(url, requestOptions);
        } else {
          throw new Error('Authentication required');
        }
      }

      return response;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<User> {
    try {
      const response = await this.apiRequest('/auth/profile');

      if (response.ok) {
        const data: { success: boolean; data: User } = await response.json();
        if (data.success) {
          this.userProfile = data.data;
          return this.userProfile;
        }
      }

      throw new Error('Failed to get user profile');
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      throw error;
    }
  }

  addAuthListener(callback: AuthListener): void {
    this.authListeners.push(callback);
  }

  removeAuthListener(callback: AuthListener): void {
    this.authListeners = this.authListeners.filter(listener => listener !== callback);
  }

  private notifyAuthListeners(isAuthenticated: boolean): void {
    this.authListeners.forEach(callback => {
      try {
        callback({
          isAuthenticated,
          user: this.userProfile,
          principal: this.principal
        });
      } catch (error) {
        console.error('❌ Auth listener error:', error);
      }
    });
  }

  hasPermission(permission: string): boolean {
    if (!this.userProfile || !this.userProfile.permissions) {
      return false;
    }

    return this.userProfile.permissions.includes(permission);
  }

  hasRole(role: UserRole): boolean {
    return this.userProfile?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.userProfile ? roles.includes(this.userProfile.role) : false;
  }

  async getDemoUsers(): Promise<DemoUser[]> {
    try {
      const response = await fetch(`${CONFIG.API_URL}/auth/dev/mock-users`);

      if (response.ok) {
        const data: { data: { mock_users: DemoUser[] } } = await response.json();
        return data.data?.mock_users || [];
      }

      return [];
    } catch (error) {
      console.error('❌ Failed to get demo users:', error);
      return [];
    }
  }

  // Getters
  get authenticated(): boolean { return this.isAuthenticated; }
  get user(): User | null { return this.userProfile; }
  get userPrincipal(): string | null { return this.principal; }
  get token(): string | null { return this.apiToken; }
}

// Create singleton instance
const iiAuth = new InternetIdentityAuth();

export default iiAuth;