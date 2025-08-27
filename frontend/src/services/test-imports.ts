// Test file to verify imports work correctly
import { AuthService, User } from './authService';
import { apiGet, apiPost } from './api';
import corruptGuardService from './corruptGuardService';

console.log('✅ All imports successful!');
console.log('AuthService:', typeof AuthService);
console.log('User interface:', typeof User);
console.log('apiGet:', typeof apiGet);
console.log('apiPost:', typeof apiPost);
console.log('corruptGuardService:', typeof corruptGuardService);

export { AuthService, User, apiGet, apiPost, corruptGuardService };
