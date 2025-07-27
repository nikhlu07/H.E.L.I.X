import React, { useState } from 'react';
import { MapPin, Users, CheckCircle, Clock, AlertTriangle, Building, Truck, FileText } from 'lucide-react';
import { useToast } from '../common/Toast';

export function DeputyDashboard() {
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState('');
  const [claimRecommendation, setClaimRecommendation] = useState('');
  const [selectedClaim, setSelectedClaim] = useState('');
  const { showToast } = useToast();

  // Mock data for district-level management
  const districtData = {
    districtName: "Mumbai Central",
    stateHead: "Rajesh Kumar (State Head)",
    allocatedBudget: 5000000,
    spentBudget: 3200000,
    remainingBudget: 1800000,
    activeProjects: 5,
    completedProjects: 12,
    pendingClaims: 3
  };

  const availableVendors = [
    { id: 'vendor-001', name: 'Maharashtra Construction Ltd', rating: 4.2, projects: 8, riskScore: 25 },
    { id: 'vendor-002', name: 'Mumbai Infrastructure Co', rating: 4.7, projects: 12, riskScore: 18 },
    { id: 'vendor-003', name: 'Central Highway Builders', rating: 3.9, projects: 5, riskScore: 45 },
    { id: 'vendor-004', name: 'Metro Development Corp', rating: 4.5, projects: 15, riskScore: 22 }
  ];

  const allocatedProjects = [
    { 
      id: 'alloc-001', 
      project: 'Highway Expansion Phase 2', 
      amount: 2500000, 
      area: 'Highway Development',
      status: 'vendor-selection',
      deadline: '2024-03-15'
    },
    { 
      id: 'alloc-002', 
      project: 'School Infrastructure Upgrade', 
      amount: 800000, 
      area: 'Education Infrastructure',
      status: 'in-progress',
      deadline: '2024-02-28'
    },
    { 
      id: 'alloc-003', 
      project: 'Hospital Equipment Purchase', 
      amount: 1200000, 
      area: 'Healthcare Equipment',
      status: 'planning',
      deadline: '2024-04-10'
    }
  ];

  const pendingClaims = [
    {
      id: 'claim-001',
      vendor: 'Maharashtra Construction Ltd',
      project: 'Highway Expansion Phase 2',
      amount: 450000,
      description: 'Phase 2A concrete laying completed',
      riskScore: 35,
      submittedAt: new Date('2024-01-15'),
      documents: 5
    },
    {
      id: 'claim-002',
      vendor: 'Mumbai Infrastructure Co',
      project: 'School Infrastructure Upgrade',
      amount: 280000,
      description: 'Classroom renovation - Building A',
      riskScore: 22,
      submittedAt: new Date('2024-01-18'),
      documents: 8
    },
    {
      id: 'claim-003',
      vendor: 'Metro Development Corp',
      project: 'Hospital Equipment Purchase',
      amount: 890000,
      description: 'Medical equipment delivery and installation',
      riskScore: 78,
      submittedAt: new Date('2024-01-20'),
      documents: 3
    }
  ];

  const communityReports = [
    {
      id: 'report-001',
      project: 'Highway Expansion Phase 2',
      reporter: 'Local Resident',
      issue: 'Construction materials quality concerns',
      location: 'Section 2A, Mumbai-Pune Highway',
      priority: 'medium',
      date: new Date('2024-01-22')
    },
    {
      id: 'report-002',
      project: 'School Infrastructure Upgrade',
      reporter: 'Parent Committee',
      issue: 'Delayed completion timeline',
      location: 'Government Primary School #47',
      priority: 'high',
      date: new Date('2024-01-25')
    }
  ];

  const handleSelectVendor = () => {
    if (!selectedVendor || !selectedAllocation) {
      showToast('Please select both vendor and project allocation', 'warning');
      return;
    }
    
    const vendor = availableVendors.find(v => v.id === selectedVendor);
    const project = allocatedProjects.find(p => p.id === selectedAllocation);
    
    showToast(`${vendor?.name} selected for ${project?.project}`, 'success');
    setSelectedVendor('');
    setSelectedAllocation('');
  };

  const handleReviewClaim = (action: 'approve' | 'reject' | 'investigate') => {
    if (!selectedClaim) {
      showToast('Please select a claim to review', 'warning');
      return;
    }

    const claim = pendingClaims.find(c => c.id === selectedClaim);
    const actionMessages = {
      approve: `Claim ${selectedClaim} recommended for approval`,
      reject: `Claim ${selectedClaim} recommended for rejection`,
      investigate: `Claim ${selectedClaim} flagged for further investigation`
    };

    showToast(actionMessages[action], action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'warning');
    setSelectedClaim('');
    setClaimRecommendation('');
  };

  const handleVerifyProject = (projectId: string) => {
    showToast('Project verification report submitted to State Head', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        {/* District Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Deputy Dashboard</h1>
              <p className="text-orange-200 text-lg">
                Managing {districtData.districtName} District Projects & Vendor Operations
              </p>
              <p className="text-orange-300 text-sm mt-1">
                Reporting to: {districtData.stateHead}
              </p>
            </div>
            <div className="text-6xl opacity-20">🏗️</div>
          </div>
        </div>

        {/* District Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">District Budget</p>
                <p className="text-2xl font-bold text-orange-600">₹{(districtData.allocatedBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-blue-600">{districtData.activeProjects}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Claims</p>
                <p className="text-2xl font-bold text-amber-600">{districtData.pendingClaims}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Budget Utilization</p>
                <p className="text-2xl font-bold text-emerald-600">{Math.round((districtData.spentBudget / districtData.allocatedBudget) * 100)}%</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vendor Selection */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Users className="h-6 w-6 text-orange-600" />
                <span>Vendor Selection</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Project Allocation
                </label>
                <select
                  value={selectedAllocation}
                  onChange={(e) => setSelectedAllocation(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Choose project...</option>
                  {allocatedProjects.filter(p => p.status === 'vendor-selection').map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.project} - ₹{project.amount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Vendor
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Choose vendor...</option>
                  {availableVendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} - {vendor.rating}★ (Risk: {vendor.riskScore})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Vendor Comparison</h4>
                <div className="space-y-2 text-sm">
                  {availableVendors.map((vendor) => (
                    <div key={vendor.id} className="flex justify-between text-blue-700">
                      <span>{vendor.name}</span>
                      <span>Rating: {vendor.rating}★ | Risk: {vendor.riskScore}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSelectVendor}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Assign Vendor to Project
              </button>
            </div>
          </div>

          {/* Claim Processing */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Review Claims</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Claim to Review
                </label>
                <select
                  value={selectedClaim}
                  onChange={(e) => setSelectedClaim(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose claim...</option>
                  {pendingClaims.map((claim) => (
                    <option key={claim.id} value={claim.id}>
                      {claim.id} - ₹{claim.amount.toLocaleString()} (Risk: {claim.riskScore})
                    </option>
                  ))}
                </select>
              </div>

              {selectedClaim && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  {(() => {
                    const claim = pendingClaims.find(c => c.id === selectedClaim);
                    return claim ? (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">{claim.vendor}</h4>
                        <p className="text-sm text-slate-600 mb-2">{claim.description}</p>
                        <div className="flex justify-between text-sm">
                          <span>Amount: ₹{claim.amount.toLocaleString()}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            claim.riskScore < 30 ? 'bg-green-100 text-green-800' :
                            claim.riskScore < 60 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Risk: {claim.riskScore}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Documents: {claim.documents} | Submitted: {claim.submittedAt.toLocaleDateString()}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={claimRecommendation}
                  onChange={(e) => setClaimRecommendation(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add your review notes and recommendation..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleReviewClaim('approve')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReviewClaim('investigate')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Investigate
                </button>
                <button
                  onClick={() => handleReviewClaim('reject')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Management */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Building className="h-6 w-6 text-purple-600" />
              <span>District Project Management</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allocatedProjects.map((project) => (
                <div key={project.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{project.project}</h3>
                      <p className="text-sm text-slate-600">{project.area}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'vendor-selection' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-lg font-bold text-slate-900">₹{project.amount.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">Deadline: {project.deadline}</div>
                  </div>
                  
                  <button
                    onClick={() => handleVerifyProject(project.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Update Progress
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Claims Overview */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="h-6 w-6 text-amber-600" />
              <span>Pending Claims for Review</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Claim ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Project</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Risk Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Submitted</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{claim.id}</td>
                      <td className="py-3 px-4">{claim.vendor}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{claim.project}</td>
                      <td className="py-3 px-4 font-semibold">₹{claim.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.riskScore < 30 ? 'bg-emerald-100 text-emerald-800' :
                          claim.riskScore < 60 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {claim.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {claim.submittedAt.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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

        {/* Community Reports */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <span>Community Reports & Feedback</span>
            </h3>
          </div>
          <div className="space-y-4">
            {communityReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{report.issue}</h4>
                    <p className="text-sm text-slate-600">Project: {report.project}</p>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{report.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.priority === 'high' ? 'bg-red-100 text-red-800' :
                      report.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.priority.toUpperCase()}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">
                      {report.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Reporter: {report.reporter}</span>
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded text-sm font-medium transition-colors">
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}