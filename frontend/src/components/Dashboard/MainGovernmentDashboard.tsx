import React, { useState } from 'react';
import { DollarSign, Users, Shield, AlertTriangle, TrendingUp, Building } from 'lucide-react';
import { mockBudgets, mockClaims, mockVendors } from '../../data/mockData';
import { useToast } from '../common/Toast';

export function MainGovernmentDashboard() {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPurpose, setBudgetPurpose] = useState('');
  const { showToast } = useToast();

  const handleLockBudget = () => {
    if (!budgetAmount || !budgetPurpose) {
      showToast('Please fill in all budget details', 'warning');
      return;
    }
    showToast(`Budget of $${budgetAmount} locked for ${budgetPurpose}`, 'success');
    setBudgetAmount('');
    setBudgetPurpose('');
  };

  const handleEmergencyPause = () => {
    showToast('Emergency pause activated - All payments suspended', 'warning');
  };

  const handleApproveVendor = (vendorId: string) => {
    showToast('Vendor approved and added to registry', 'success');
  };

  const totalBudget = mockBudgets.reduce((sum, budget) => sum + budget.totalAmount, 0);
  const allocatedBudget = mockBudgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
  const criticalClaims = mockClaims.filter(claim => claim.riskLevel === 'critical').length;
  const pendingVendors = mockVendors.filter(vendor => vendor.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header is rendered by DashboardLayout */}
      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-slate-900">${(totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Allocated Budget</p>
                <p className="text-2xl font-bold text-slate-900">${(allocatedBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalClaims}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Vendors</p>
                <p className="text-2xl font-bold text-amber-600">{pendingVendors}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Control Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Budget Control Panel</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Budget Amount ($)
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Purpose
                </label>
                <input
                  type="text"
                  value={budgetPurpose}
                  onChange={(e) => setBudgetPurpose(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Infrastructure Development 2024"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleLockBudget}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Lock Budget
                </button>
                <button
                  onClick={handleEmergencyPause}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Emergency Pause
                </button>
              </div>
            </div>
          </div>

          {/* Vendor Registry */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Building className="h-6 w-6 text-purple-600" />
                <span>Vendor Registry</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockVendors.map((vendor) => (
                  <div key={vendor.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
                        <p className="text-sm text-slate-600">{vendor.businessType}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : vendor.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                      <div>Projects: {vendor.completedProjects}</div>
                      <div>Rating: {vendor.averageRating}/5</div>
                      <div>Risk Score: {vendor.riskScore}</div>
                      <div className="col-span-2">Email: {vendor.contactEmail}</div>
                    </div>

                    {vendor.status === 'pending' && (
                      <button
                        onClick={() => handleApproveVendor(vendor.id)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                      >
                        Approve Vendor
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Claims */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Recent Claims & Corruption Alerts</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Claim ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Risk Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{claim.id}</td>
                      <td className="py-3 px-4 font-semibold">${claim.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                          claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          claim.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {claim.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          claim.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          claim.status === 'under-review' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {claim.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}