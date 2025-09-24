import { useState } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';

interface LoginPageProps {
  onLogin?: (role: string) => void;
  onBackToLanding?: () => void;
}

export function SimpleLoginPage({ onLogin, onBackToLanding }: LoginPageProps) {
  const { login, logout, isAuthenticated, user, loading, error } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();

      if (onLogin && user) {
        onLogin(user.role);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onBackToLanding) {
        onBackToLanding();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 mb-4">You are successfully authenticated</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Title:</strong> {user.title}</p>
                <p><strong>Principal:</strong> {user.principal_id.substring(0, 20)}...</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onLogin?.(user.role)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enter Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Internet Identity Login</h1>
          <p className="text-gray-600 mb-6">
            Sign in with your Internet Identity to access the corruption detection platform
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              '🔐 Login with Internet Identity'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Don't have Internet Identity?</p>
            <a
              href="https://identity.ic0.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Create one here →
            </a>
          </div>

          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
