// Simple API client for backend calls
// Uses VITE_BACKEND_URL if provided, else defaults to same origin

export const API_BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || '';

// Helper to get auth headers
function getAuthHeaders(): Record<string, string> {
  // Check for demo token first
  const demoToken = localStorage.getItem('demo_access_token');
  if (demoToken) {
    return { 'Authorization': `Bearer ${demoToken}` };
  }
  
  // Check for II token from auth service
  // This will be handled by components that have access to authService
  return {};
}

export async function apiGet<T = any>(path: string, init?: RequestInit, includeAuth: boolean = true): Promise<{ data: T; headers: Headers }>{
  const url = API_BASE_URL + path;
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(init?.headers || {}),
  };
  
  // Add auth headers if requested
  if (includeAuth) {
    Object.assign(headers, getAuthHeaders());
  }
  
  const res = await fetch(url, {
    method: 'GET',
    headers,
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : (await res.text());
  return { data, headers: res.headers };
}

export async function apiPost<T = any>(path: string, body: any, init?: RequestInit, includeAuth: boolean = true): Promise<{ data: T; headers: Headers }> {
  const url = API_BASE_URL + path;
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  
  // Add auth headers if requested
  if (includeAuth) {
    Object.assign(headers, getAuthHeaders());
  }
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : (await res.text());
  return { data, headers: res.headers };
}

// Helper function to make authenticated requests with a specific token
export async function apiGetWithToken<T = any>(path: string, token: string, init?: RequestInit): Promise<{ data: T; headers: Headers }> {
  const url = API_BASE_URL + path;
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(init?.headers || {}),
  };
  
  const res = await fetch(url, {
    method: 'GET',
    headers,
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'text');
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : (await res.text());
  return { data, headers: res.headers };
}

export async function apiPostWithToken<T = any>(path: string, body: any, token: string, init?: RequestInit): Promise<{ data: T; headers: Headers }> {
  const url = API_BASE_URL + path;
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(init?.headers || {}),
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'text');
    throw new Error(`POST ${path} failed: ${res.status} ${res.statusText} ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : (await res.text());
  return { data, headers: res.headers };
}

export type HealthResponse = {
  status: string;
  timestamp: number;
  services: Record<string, string>;
  version: string;
  fraud_stats: {
    total_rules: number;
    historical_claims: number;
    ml_features: number;
  };
};

export type RootResponse = {
  service: string;
  version: string;
  status: string;
  description: string;
  environment: string;
  features: Record<string, string>;
  fraud_engine: {
    rules_loaded: number;
    ml_model_trained: boolean;
    historical_data_points: number;
  };
  timestamp: number;
};

export async function getHealth() {
  return apiGet<HealthResponse>('/health');
}

export async function getRoot() {
  return apiGet<RootResponse>('/');
}
