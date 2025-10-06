import React, { useState } from 'react';
import { Users, MapPin, DollarSign, AlertTriangle, UserPlus, Settings, BarChart3, Shield, LayoutDashboard, Eye, FileText } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

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
              State Head Dashboard
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Overseeing {stateData.stateName} State Procurement & Regional Development
            </p>
          </div>

          {/* State Overview Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total State Budget</CardTitle>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">₹{(stateData.totalBudget / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-gray-500">Fiscal Year 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Deputies</CardTitle>
                <Users className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stateData.deputiesCount}</div>
                <p className="text-xs text-gray-500">Across all districts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stateData.activeProjects}</div>
                <p className="text-xs text-gray-500">Currently underway</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Risk Score</CardTitle>
                <Shield className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stateData.averageRiskScore}</div>
                <p className="text-xs text-gray-500">Across all projects</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Budget Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Allocate State Budget</CardTitle>
                <CardDescription className="text-gray-600">Distribute funds to projects and deputies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="text-sm text-yellow-700">
                    <strong>Available Budget:</strong> ₹{(stateData.remainingBudget / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-yellow-600 mt-1">
                    Allocated: ₹{(stateData.allocatedBudget / 1000000).toFixed(1)}M / ₹{(stateData.totalBudget / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allocation Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter allocation amount..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Area/Description
                  </label>
                  <input
                    type="text"
                    value={projectArea}
                    onChange={(e) => setProjectArea(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Highway Development Phase 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Deputy
                  </label>
                  <select
                    value={selectedDeputy}
                    onChange={(e) => setSelectedDeputy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select Deputy...</option>
                    {deputies.map((deputy) => (
                      <option key={deputy.id} value={deputy.name}>
                        {deputy.name} - {deputy.district}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleAllocateBudget}
                  className="w-full cta-gradient font-semibold"
                  size="lg"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Allocate Budget
                </Button>
              </CardContent>
            </Card>

            {/* Deputy Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Deputy Management</CardTitle>
                <CardDescription className="text-gray-600">Add or remove deputies from your state.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Propose New Deputy
                  </label>
                  <input
                    type="text"
                    value={newDeputyId}
                    onChange={(e) => setNewDeputyId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter deputy principal ID..."
                  />
                  <Button
                    onClick={handleProposeDeputy}
                    className="w-full mt-3 cta-gradient font-semibold"
                    size="lg"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Propose Deputy
                  </Button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remove Deputy
                  </label>
                  <select
                    value={deputyToRemove}
                    onChange={(e) => setDeputyToRemove(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select deputy to remove...</option>
                    {deputies.map((deputy) => (
                      <option key={deputy.id} value={deputy.name}>
                        {deputy.name} - {deputy.district}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleRemoveDeputy}
                    variant="destructive"
                    className="w-full mt-3 font-semibold"
                    size="lg"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Remove Deputy
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="text-sm text-yellow-700">
                    <strong>Note:</strong> Deputy proposals require confirmation after 24-hour review period for security.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deputy Performance Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Deputy Performance Dashboard</CardTitle>
              <CardDescription className="text-gray-600">Monitor the performance and risk scores of your deputies.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deputy</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Active Projects</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deputies.map((deputy) => (
                    <TableRow key={deputy.id} className="table-row-hover">
                      <TableCell className="font-semibold">{deputy.name}</TableCell>
                      <TableCell className="text-gray-600">{deputy.district}</TableCell>
                      <TableCell className="text-center">{deputy.projects}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{deputy.performance}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deputy.riskScore < 30 ? 'bg-emerald-100 text-emerald-800' :
                          deputy.riskScore < 50 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {deputy.riskScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700">
                          <Eye className="mr-1 h-4 w-4" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Allocations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Pending Budget Allocations</CardTitle>
              <CardDescription className="text-gray-600">Review and approve budget requests from deputies.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {pendingAllocations.map((allocation) => (
                  <div key={allocation.id} className="rounded-xl border p-4 space-y-3 hover:border-yellow-500 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{allocation.project}</h3>
                        <p className="text-sm text-gray-600">Requested: ₹{allocation.requestedAmount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          allocation.priority === 'high' ? 'bg-red-100 text-red-800' :
                          allocation.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {allocation.priority.toUpperCase()}
                        </span>
                        <Button
                          onClick={() => handleApproveAllocation(allocation.id, allocation.requestedAmount)}
                          className="cta-gradient text-sm font-medium"
                          size="sm"
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-red-600" />Regional Corruption Alerts</CardTitle>
              <CardDescription className="text-gray-600">Critical alerts requiring immediate attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {regionalAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border p-4 space-y-3 hover:border-red-500 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{alert.description}</h4>
                        <p className="text-sm text-gray-600">Deputy: {alert.deputy}</p>
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
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
