import React, { useState } from 'react';
import { MapPin, Users, CheckCircle, Clock, AlertTriangle, Building, Truck, FileText, Eye, ChevronDown } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function DeputyDashboard() {
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState('');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
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

  const handleReviewClaim = (claimId: string, action: 'approve' | 'reject' | 'investigate') => {
    const actionMessages = {
      approve: `Claim ${claimId} recommended for approval`,
      reject: `Claim ${claimId} recommended for rejection`,
      investigate: `Claim ${claimId} flagged for further investigation`
    };

    showToast(actionMessages[action], action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'warning');
    setExpandedClaimId(null);
  };

  const handleVerifyProject = (id: string) => {
    showToast('Project verification report submitted to State Head', 'success');
  };

  const toggleClaimExpansion = (claimId: string) => {
    setExpandedClaimId(prevId => (prevId === claimId ? null : claimId));
  };

  return (
    <>
      <style>{`
          body {
              font-family: 'Inter', sans-serif;
              background: #F7FAFC;
          }
          .card {
              background: #FFFFFF;
              border: 1px solid #E2E8F0;
              transition: all 0.3s ease;
              border-radius: 0.75rem;
          }
          .card:hover {
              border-color: #F59E0B; /* yellow-500 */
              transform: translateY(-5px);
              box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1);
          }
          .cta-gradient {
              background: linear-gradient(90deg, #FBBF24, #F59E0B); /* yellow-400 to yellow-500 */
              color: white;
              transition: opacity 0.3s ease;
          }
          .cta-gradient:hover {
              opacity: 0.9;
          }
          .table-row-hover:hover {
            background-color: #F7FAFC;
          }
        `}</style>
      <div className="min-h-screen bg-gray-50 font-sans">
        <main className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex rounded-full bg-yellow-100 p-4">
              <MapPin className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              Deputy Dashboard
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Managing {districtData.districtName} District Projects & Vendor Operations
            </p>
          </div>

          {/* District Overview Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">District Budget</CardTitle>
                <Building className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">₹{(districtData.allocatedBudget / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-gray-500">Fiscal Year 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
                <Truck className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{districtData.activeProjects}</div>
                <p className="text-xs text-gray-500">Currently underway</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Claims</CardTitle>
                <Clock className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{districtData.pendingClaims}</div>
                <p className="text-xs text-gray-500">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Budget Utilization</CardTitle>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{Math.round((districtData.spentBudget / districtData.allocatedBudget) * 100)}%</div>
                <p className="text-xs text-gray-500">Of total budget</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Vendor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Vendor Selection</CardTitle>
                <p className="text-gray-600">Assign vendors to projects.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project Allocation
                  </label>
                  <select
                    value={selectedAllocation}
                    onChange={(e) => setSelectedAllocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vendor
                  </label>
                  <select
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Choose vendor...</option>
                    {availableVendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} - {vendor.rating}★ (Risk: {vendor.riskScore})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleSelectVendor}
                  className="w-full cta-gradient font-semibold"
                  size="lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Assign Vendor to Project
                </Button>
              </CardContent>
            </Card>

            {/* Claim Processing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Review Claims</CardTitle>
                <p className="text-gray-600">Approve, reject, or investigate claims.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingClaims.map((claim) => (
                  <div key={claim.id} className="rounded-xl border p-4 transition-all duration-300 ease-in-out">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleClaimExpansion(claim.id)}
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{claim.vendor}</h4>
                        <p className="text-sm text-gray-600">{claim.project}</p>
                        <p className="text-sm font-bold text-gray-800 mt-1">₹{claim.amount.toLocaleString()}</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedClaimId === claim.id ? 'rotate-180' : ''}`} />
                    </div>
                    {expandedClaimId === claim.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">{claim.description}</p>
                        <div className="text-xs text-gray-500 mb-4 space-y-1">
                            <p><strong>Submitted:</strong> {claim.submittedAt.toLocaleDateString()}</p>
                            <p><strong>Documents:</strong> {claim.documents}</p>
                            <p><strong>Risk Score:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                claim.riskScore < 30 ? 'bg-emerald-100 text-emerald-800' :
                                claim.riskScore < 60 ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                                }`}>
                                {claim.riskScore}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                            <Button
                                onClick={() => handleReviewClaim(claim.id, 'approve')}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Approve
                            </Button>
                            <Button
                                onClick={() => handleReviewClaim(claim.id, 'investigate')}
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Investigate
                            </Button>
                            <Button
                                onClick={() => handleReviewClaim(claim.id, 'reject')}
                                size="sm"
                                variant="destructive"
                            >
                                Reject
                            </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Project Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">District Project Management</CardTitle>
              <p className="text-gray-600">Monitor the progress of projects in your district.</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocatedProjects.map((project) => (
                    <TableRow key={project.id} className="table-row-hover">
                      <TableCell className="font-semibold">{project.project}</TableCell>
                      <TableCell className="text-gray-600">{project.area}</TableCell>
                      <TableCell>₹{project.amount.toLocaleString()}</TableCell>
                      <TableCell>{project.deadline}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'vendor-selection' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700" onClick={() => handleVerifyProject(project.id)}>
                          <Eye className="mr-1 h-4 w-4" /> Update Progress
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Community Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-red-600" />Community Reports & Feedback</CardTitle>
              <p className="text-gray-600">Feedback and reports from the community.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {communityReports.map((report) => (
                  <div key={report.id} className="rounded-xl border p-4 space-y-3 hover:border-red-500 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{report.issue}</h4>
                        <p className="text-sm text-gray-600">Project: {report.project}</p>
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
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded text-sm font-medium transition-colors">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
