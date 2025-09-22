import React, { useState } from 'react';
import { DollarSign, Users, Shield, AlertTriangle, TrendingUp, Building } from 'lucide-react';
import { mockBudgets, mockClaims, mockVendors } from '../../data/mockData';

export function LeadAgencyDashboard() {
  const totalBudget = mockBudgets.reduce((sum, budget) => sum + budget.totalAmount, 0);
  const allocatedBudget = mockBudgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
  const criticalAlerts = mockClaims.filter(claim => claim.riskLevel === 'critical').length;
  const pendingPartners = mockVendors.filter(vendor => vendor.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={DollarSign} title="Total Budget" value={`$${(totalBudget / 1000000).toFixed(1)}M`} color="primary" />
          <StatCard icon={TrendingUp} title="Allocated Budget" value={`$${(allocatedBudget / 1000000).toFixed(1)}M`} color="green" />
          <StatCard icon={AlertTriangle} title="Critical Alerts" value={criticalAlerts} color="red" />
          <StatCard icon={Users} title="Pending Partners" value={pendingPartners} color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Global Fund Management */}
          <div className="bg-helix-gray-900 rounded-2xl shadow-lg border border-helix-gray-800">
            <div className="p-6 border-b border-helix-gray-800">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Global Fund Management</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Budget allocation form can be added here */}
              <p className="text-helix-gray-400">Fund management controls will be available here.</p>
            </div>
          </div>

          {/* Partner Registry */}
          <div className="bg-helix-gray-900 rounded-2xl shadow-lg border border-helix-gray-800">
            <div className="p-6 border-b border-helix-gray-800">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Building className="h-6 w-6 text-primary" />
                <span>Partner Registry</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockVendors.map((vendor) => (
                  <div key={vendor.id} className="border border-helix-gray-700 rounded-xl p-4 bg-helix-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                        <p className="text-sm text-helix-gray-400">{vendor.businessType}</p>
                      </div>
                      <StatusBadge status={vendor.status} />
                    </div>
                    {vendor.status === 'pending' && (
                      <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-helix-accent-dark">
                        Approve Partner
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colors = {
    primary: 'text-primary',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-helix-gray-900 rounded-2xl p-6 shadow-lg border border-helix-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-helix-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
        </div>
        <div className={`p-3 bg-helix-gray-800 rounded-xl`}>
          <Icon className={`h-6 w-6 ${colors[color]}`} />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    approved: 'bg-green-900/50 text-green-300 border-green-700',
    pending: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    rejected: 'bg-red-900/50 text-red-300 border-red-700',
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-helix-gray-700'}`}>
      {status.toUpperCase()}
    </div>
  );
};
