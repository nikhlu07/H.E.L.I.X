import React, { useState } from 'react';
import { Users, MapPin, DollarSign, AlertTriangle, UserPlus, Settings, BarChart3, Shield } from 'lucide-react';
import { useToast } from '../common/Toast';

export function StateHeadDashboard() {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [projectArea, setProjectArea] = useState('');
  const [selectedDeputy, setSelectedDeputy] = useState('');
  const [newDeputyId, setNewDeputyId] = useState('');
  const [deputyToRemove, setDeputyToRemove] = useState('');
  const { showToast } = useToast();

  // Mock data for state-level management
  const stateData = {
    stateName: "Maharashtra",
    totalBudget: 25000000,
    allocatedBudget: 18500000,
    remainingBudget: 6500000,
    activeProjects: 23,
    deputiesCount: 8,
    averageRiskScore: 32
  };

  const deputies = [
    { id: 'dep-001', name: 'Rajesh Kumar', district: 'Mumbai Central', projects: 5, performance: 4.2, riskScore: 25 },
    { id: 'dep-002', name: 'Priya Sharma', district: 'Pune East', projects: 3, performance: 4.7, riskScore: 18 },
    { id: 'dep-003', name: 'Amit Patel', district: 'Nagpur North', projects: 4, performance: 3.9, riskScore: 45 },
    { id: 'dep-004', name: 'Sunita Desai', district: 'Nashik South', projects: 6, performance: 4.5, riskScore: 22 }
  ];

  const pendingAllocations = [
    { id: 'alloc-001', project: 'Highway Extension Phase 2', requestedAmount: 2500000, priority: 'high' },
    { id: 'alloc-002', project: 'School Infrastructure Upgrade', requestedAmount: 800000, priority: 'medium' },
    { id: 'alloc-003', project: 'Hospital Equipment Purchase', requestedAmount: 1200000, priority: 'high' }
  ];

  const regionalAlerts = [
    { id: 'alert-001', type: 'corruption', description: 'Unusual vendor pattern in Mumbai Central', severity: 'high', deputy: 'Rajesh Kumar' },
    { id: 'alert-002', type: 'budget', description: 'Budget utilization above 90% in Pune East', severity: 'medium', deputy: 'Priya Sharma' },
    { id: 'alert-003', type: 'timeline', description: 'Project delays reported in Nagpur North', severity: 'low', deputy: 'Amit Patel' }
  ];

  const handleAllocateBudget = () => {
    if (!budgetAmount || !projectArea || !selectedDeputy) {
      showToast('Please fill in all allocation details', 'warning');
      return;
    }
    
    const amount = parseInt(budgetAmount);
    if (amount > stateData.remainingBudget) {
      showToast('Allocation amount exceeds remaining budget', 'error');
      return;
    }

    showToast(`₹${amount.toLocaleString()} allocated to ${projectArea} under ${selectedDeputy}`, 'success');
    setBudgetAmount('');
    setProjectArea('');
    setSelectedDeputy('');
  };

  const handleProposeDeputy = () => {
    if (!newDeputyId) {
      showToast('Please enter deputy principal ID', 'warning');
      return;
    }
    showToast(`Deputy proposal submitted for: ${newDeputyId}`, 'success');
    setNewDeputyId('');
  };

  const handleRemoveDeputy = () => {
    if (!deputyToRemove) {
      showToast('Please select deputy to remove', 'warning');
      return;
    }
    showToast(`Deputy removal initiated for: ${deputyToRemove}`, 'success');
    setDeputyToRemove('');
  };

  const handleApproveAllocation = (allocationId: string, amount: number) => {
    showToast(`Budget allocation of ₹${amount.toLocaleString()} approved`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header is rendered by DashboardLayout */}
      <div className="container mx-auto px-6 py-8">
        {/* State Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">State Head Dashboard</h1>
              <p className="text-emerald-200 text-lg">
                Managing {stateData.stateName} State Procurement & Regional Development
              </p>
            </div>
            <div className="text-6xl opacity-20">🏛️</div>
          </div>
        </div>

        {/* State Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total State Budget</p>
                <p className="text-2xl font-bold text-emerald-600">₹{(stateData.totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Deputies</p>
                <p className="text-2xl font-bold text-blue-600">{stateData.deputiesCount}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-purple-600">{stateData.activeProjects}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Risk Score</p>
                <p className="text-2xl font-bold text-amber-600">{stateData.averageRiskScore}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Allocation */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
                <span>Allocate State Budget</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <div className="text-sm text-emerald-700">
                  <strong>Available Budget:</strong> ₹{(stateData.remainingBudget / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-emerald-600 mt-1">
                  Allocated: ₹{(stateData.allocatedBudget / 1000000).toFixed(1)}M / ₹{(stateData.totalBudget / 1000000).toFixed(1)}M
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Allocation Amount (₹)
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter allocation amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Area/Description
                </label>
                <input
                  type="text"
                  value={projectArea}
                  onChange={(e) => setProjectArea(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Highway Development Phase 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assign to Deputy
                </label>
                <select
                  value={selectedDeputy}
                  onChange={(e) => setSelectedDeputy(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Deputy...</option>
                  {deputies.map((deputy) => (
                    <option key={deputy.id} value={deputy.name}>
                      {deputy.name} - {deputy.district}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAllocateBudget}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Allocate Budget
              </button>
            </div>
          </div>

          {/* Deputy Management */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <UserPlus className="h-6 w-6 text-blue-600" />
                <span>Deputy Management</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Propose New Deputy
                </label>
                <input
                  type="text"
                  value={newDeputyId}
                  onChange={(e) => setNewDeputyId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter deputy principal ID..."
                />
                <button
                  onClick={handleProposeDeputy}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Propose Deputy
                </button>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Remove Deputy
                </label>
                <select
                  value={deputyToRemove}
                  onChange={(e) => setDeputyToRemove(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select deputy to remove...</option>
                  {deputies.map((deputy) => (
                    <option key={deputy.id} value={deputy.name}>
                      {deputy.name} - {deputy.district}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleRemoveDeputy}
                  className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Remove Deputy
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="text-sm text-amber-700">
                  <strong>Note:</strong> Deputy proposals require confirmation after 24-hour review period for security.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deputy Performance Overview */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span>Deputy Performance Dashboard</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Deputy</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">District</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Active Projects</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Performance</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Risk Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deputies.map((deputy) => (
                    <tr key={deputy.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{deputy.name}</td>
                      <td className="py-3 px-4 text-slate-600">{deputy.district}</td>
                      <td className="py-3 px-4 text-center">{deputy.projects}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{deputy.performance}</span>
                          <span className="text-amber-500">★</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deputy.riskScore < 30 ? 'bg-emerald-100 text-emerald-800' :
                          deputy.riskScore < 50 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {deputy.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Allocations */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Settings className="h-6 w-6 text-amber-600" />
              <span>Pending Budget Allocations</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingAllocations.map((allocation) => (
                <div key={allocation.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{allocation.project}</h3>
                      <p className="text-sm text-slate-600">Requested: ₹{allocation.requestedAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        allocation.priority === 'high' ? 'bg-red-100 text-red-800' :
                        allocation.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {allocation.priority.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleApproveAllocation(allocation.id, allocation.requestedAmount)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Alerts */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span>Regional Corruption Alerts</span>
            </h3>
          </div>
          <div className="space-y-4">
            {regionalAlerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{alert.description}</h4>
                    <p className="text-sm text-slate-600">Deputy: {alert.deputy}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}