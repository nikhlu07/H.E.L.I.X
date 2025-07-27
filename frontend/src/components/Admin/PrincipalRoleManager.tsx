import React, { useState, useEffect } from 'react';
import { Shield, Users, Plus, Trash2, Save } from 'lucide-react';
import { authService } from '../../services/authService';

interface PrincipalRole {
  principalId: string;
  role: string;
  name?: string;
}

const AVAILABLE_ROLES = [
  'main_government',
  'state_head', 
  'deputy',
  'vendor',
  'sub_supplier',
  'citizen'
];

export function PrincipalRoleManager() {
  const [mappings, setMappings] = useState<PrincipalRole[]>([]);
  const [newPrincipal, setNewPrincipal] = useState('');
  const [newRole, setNewRole] = useState('citizen');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // Load existing mappings
    const existingMappings = authService.getRoleMappings();
    const mappingArray = Object.entries(existingMappings).map(([principalId, role]) => ({
      principalId,
      role,
    }));
    setMappings(mappingArray);
  }, []);

  const handleAddMapping = () => {
    if (!newPrincipal.trim()) return;

    const newMapping: PrincipalRole = {
      principalId: newPrincipal.trim(),
      role: newRole,
      name: newName.trim() || undefined,
    };

    // Add to auth service
    authService.addPrincipalRole(newMapping.principalId, newMapping.role);
    
    // Update local state
    setMappings(prev => [...prev, newMapping]);
    
    // Reset form
    setNewPrincipal('');
    setNewRole('citizen');
    setNewName('');
  };

  const handleRemoveMapping = (principalId: string) => {
    setMappings(prev => prev.filter(m => m.principalId !== principalId));
    // Note: authService doesn't have a remove method, you'd need to implement that
  };

  const getRoleName = (role: string): string => {
    switch (role) {
      case 'main_government': return 'Government Official';
      case 'state_head': return 'State Head';
      case 'deputy': return 'Deputy Officer';
      case 'vendor': return 'Vendor/Contractor';
      case 'sub_supplier': return 'Sub-Supplier';
      case 'citizen': return 'Citizen Observer';
      default: return role;
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'main_government': return 'bg-blue-100 text-blue-800';
      case 'state_head': return 'bg-emerald-100 text-emerald-800';
      case 'deputy': return 'bg-orange-100 text-orange-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      case 'sub_supplier': return 'bg-teal-100 text-teal-800';
      case 'citizen': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Principal ID Role Management
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Map Internet Identity Principal IDs to specific roles in the system
          </p>
        </div>

        {/* Add New Mapping */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-green-600" />
            Add New Principal Role Mapping
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal ID
              </label>
              <input
                type="text"
                value={newPrincipal}
                onChange={(e) => setNewPrincipal(e.target.value)}
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-cai"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AVAILABLE_ROLES.map(role => (
                  <option key={role} value={role}>
                    {getRoleName(role)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="User display name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleAddMapping}
                disabled={!newPrincipal.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Mapping
              </button>
            </div>
          </div>
        </div>

        {/* Current Mappings */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Current Principal Role Mappings ({mappings.length})
          </h3>
          
          {mappings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No principal role mappings configured yet.</p>
              <p className="text-sm">Add mappings above to assign specific roles to Internet Identity users.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mappings.map((mapping, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {mapping.name || 'Unnamed User'}
                        </p>
                        <p className="text-xs font-mono text-gray-600 break-all">
                          {mapping.principalId}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(mapping.role)}`}>
                          {getRoleName(mapping.role)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveMapping(mapping.principalId)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove mapping"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How to find Principal IDs:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Users can find their Principal ID after logging in with Internet Identity</li>
            <li>• Check browser console logs during login for Principal ID</li>
            <li>• Principal IDs are unique identifiers for each Internet Identity</li>
            <li>• Users without explicit mappings will default to 'citizen' role</li>
          </ul>
        </div>
      </div>
    </div>
  );
}