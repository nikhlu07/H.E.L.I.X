import React from 'react';

interface DashboardProps {
  role: string;
  sector: string;
}

export function BasicDashboard({ role, sector }: DashboardProps) {
  const getRoleDisplayName = (role: string): string => {
    const roleMap: Record<string, string> = {
      'lead_agency': 'Lead Agency Director',
      'field_director': 'Field Director',
      'program_manager': 'Program Manager',
      'logistics_partner': 'Logistics Partner',
      'local_supplier': 'Local Supplier',
      'auditor': 'Auditor',
    };
    return roleMap[role] || role.replace('_', ' ').toUpperCase();
  };

  const getSectorDisplayName = (sector: string): string => {
    const sectorMap: Record<string, string> = {
      'government': 'Government',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'infrastructure': 'Infrastructure',
      'defense': 'Defense',
    };
    return sectorMap[sector] || sector;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to H.E.L.I.X. Dashboard
          </h1>
          <p className="text-gray-600">
            Role: {getRoleDisplayName(role)} | Sector: {getSectorDisplayName(sector)}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
            <p className="text-3xl font-bold text-primary-600">42</p>
            <p className="text-sm text-gray-500">Active initiatives</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget</h3>
            <p className="text-3xl font-bold text-green-600">₹2.1B</p>
            <p className="text-sm text-gray-500">Total allocation</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance</h3>
            <p className="text-3xl font-bold text-blue-600">98%</p>
            <p className="text-sm text-gray-500">RTI compliance rate</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fraud Detected</h3>
            <p className="text-3xl font-bold text-red-600">3</p>
            <p className="text-sm text-gray-500">Potential cases</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New project approved</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Audit scheduled</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Budget review pending</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Create New Project
            </button>
            <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Submit Report
            </button>
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Request Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}