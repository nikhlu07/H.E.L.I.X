import React, { useState } from 'react';
import { authService } from '../../services/authService';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onDemoLogin?: (role: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onDemoLogin }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const roles = [
    { value: 'national_authority', label: 'National Authority', description: 'Oversee national procurement policies and monitor cross-regional contracts' },
    { value: 'state_head', label: 'State Head', description: 'Manage state-level procurement and approve major contracts within the state' },
    { value: 'deputy', label: 'Deputy Commissioner', description: 'Execute procurement at district level and monitor vendor performance' },
    { value: 'vendor', label: 'Vendor', description: 'Submit bids, manage contracts, and track payments for awarded projects' },
    { value: 'sub_supplier', label: 'Sub-Supplier', description: 'Fulfill delivery obligations and provide goods/services to main vendors' },
    { value: 'citizen', label: 'Citizen', description: 'Monitor transparency, report irregularities, and track public spending' }
  ];

  const handleInternetIdentityLogin = async () => {
    if (!selectedRole) {
      setError('Please select a role before logging in');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.login();
      onLoginSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Internet Identity login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    setError('');

    try {
      await authService.demoLogin(role);
      onDemoLogin?.(role);
      onLoginSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
      console.error('Demo login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome to H.E.L.I.X</h1>
          <p>Holistic Ecosystem for Limiting Irregular Expenditure</p>
        </div>

        <div className="role-selection">
          <h2>Select Your Role</h2>
          <div className="role-grid">
            {roles.map((role) => (
              <div
                key={role.value}
                className={`role-card ${selectedRole === role.value ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.value)}
              >
                <h3>{role.label}</h3>
                <p>{role.description}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="login-actions">
          <button
            className="btn-primary"
            onClick={handleInternetIdentityLogin}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? 'Connecting...' : 'Login with Internet Identity'}
          </button>

          <button
            className="btn-secondary"
            onClick={() => selectedRole && handleDemoLogin(selectedRole)}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? 'Loading...' : 'Try Demo Mode'}
          </button>
        </div>

        <div className="login-info">
          <h3>About Internet Identity</h3>
          <p>
            Internet Identity provides secure, passwordless authentication using WebAuthn standards. 
            Your identity is protected by your device's biometric sensors or security keys.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;