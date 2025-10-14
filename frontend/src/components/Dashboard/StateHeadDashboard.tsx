import React, { useState, useRef } from 'react';
import { Users, MapPin, DollarSign, AlertTriangle, UserPlus, Settings, BarChart3, Shield, LayoutDashboard, Eye, FileText, Building } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function StateHeadDashboard() {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [projectArea, setProjectArea] = useState('');
  const [selectedDeputy, setSelectedDeputy] = useState('');
  const [newDeputyId, setNewDeputyId] = useState('');
  const [deputyToRemove, setDeputyToRemove] = useState('');
  const { showToast } = useToast();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
      visible: (i: number) => ({
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
              delay: i * 0.2,
              duration: 0.5,
          },
      }),
      hidden: {
          filter: "blur(10px)",
          y: -20,
          opacity: 0,
      },
  };

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
      <section
          className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start"
          ref={dashboardRef}
      >
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
          <main className="max-w-7xl mx-auto w-full z-10">
              {/* Header */}
              <article className="text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                      <VerticalCutReveal
                          splitBy="words"
                          staggerDuration={0.15}
                          staggerFrom="first"
                          reverse={true}
                          containerClassName="justify-center"
                          transition={{
                              type: "spring",
                              stiffness: 250,
                              damping: 40,
                              delay: 0,
                          }}
                      >
                          State Head Dashboard
                      </VerticalCutReveal>
                  </h1>
                  <TimelineContent
                      as="p"
                      animationNum={0}
                      timelineRef={dashboardRef}
                      customVariants={revealVariants}
                      className="text-gray-600 text-lg"
                  >
                      Overseeing {stateData.stateName} State Procurement & Regional Development.
                  </TimelineContent>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                      {/* Key Metrics */}
                      <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold">State Overview</CardTitle>
                                  <CardDescription>Real-time overview of the state's metrics.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <DollarSign className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Total Budget</p>
                                      <p className="text-2xl font-bold text-gray-900">₹{(stateData.totalBudget / 1000000).toFixed(1)}M</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <Users className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Active Deputies</p>
                                      <p className="text-2xl font-bold text-gray-900">{stateData.deputiesCount}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <BarChart3 className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                                      <p className="text-2xl font-bold text-gray-900">{stateData.activeProjects}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-red-50 rounded-lg">
                                      <Shield className="h-6 w-6 text-red-500 mb-2" />
                                      <p className="text-sm font-medium text-red-600">Avg Risk Score</p>
                                      <p className="text-2xl font-bold text-red-600">{stateData.averageRiskScore}</p>
                                  </div>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* Deputy Performance Overview */}
                      <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">Deputy Performance Dashboard</CardTitle>
                            <CardDescription>Monitor the performance and risk scores of your deputies.</CardDescription>
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
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {deputies.map((deputy) => (
                                  <TableRow key={deputy.id} className="hover:bg-gray-50/50">
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
                                        deputy.riskScore < 30 ? 'bg-green-100 text-green-800' :
                                        deputy.riskScore < 50 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {deputy.riskScore}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                                        <Eye className="mr-1 h-4 w-4" /> View
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TimelineContent>

                      {/* Pending Allocations */}
                      <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">Pending Budget Allocations</CardTitle>
                            <CardDescription>Review and approve budget requests from deputies.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {pendingAllocations.map((allocation) => (
                              <div key={allocation.id} className="rounded-xl border p-4 space-y-3 hover:border-black transition-colors cursor-pointer bg-gray-50/50">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{allocation.project}</h3>
                                    <p className="text-sm text-gray-600">Requested: ₹{allocation.requestedAmount.toLocaleString()}</p>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      allocation.priority === 'high' ? 'bg-red-100 text-red-800' :
                                      allocation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {allocation.priority}
                                    </span>
                                    <Button
                                      onClick={() => handleApproveAllocation(allocation.id, allocation.requestedAmount)}
                                      className="p-2 h-auto border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                                      size="sm"
                                    >
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </TimelineContent>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                       {/* Budget Allocation */}
                       <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold">Allocate State Budget</CardTitle>
                              <CardDescription>Distribute funds to projects and deputies.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                                <div className="text-sm font-medium text-yellow-800">Available to Allocate</div>
                                <div className="text-lg font-bold text-yellow-900">₹{(stateData.remainingBudget).toLocaleString()}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
                                <input
                                  type="number"
                                  value={budgetAmount}
                                  onChange={(e) => setBudgetAmount(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  placeholder="e.g., 500000"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Project Area</label>
                                <input
                                  type="text"
                                  value={projectArea}
                                  onChange={(e) => setProjectArea(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  placeholder="e.g., Highway Development"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Assign to Deputy</label>
                                <select
                                  value={selectedDeputy}
                                  onChange={(e) => setSelectedDeputy(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                  <option value="">Select Deputy...</option>
                                  {deputies.map((deputy) => (
                                    <option key={deputy.id} value={deputy.name}>
                                      {deputy.name} - {deputy.district}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <Button onClick={handleAllocateBudget} className="w-full p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800">
                                <DollarSign className="mr-2 h-5 w-5" />
                                Allocate Budget
                              </Button>
                            </CardContent>
                          </Card>
                       </TimelineContent>
                      
                      {/* Deputy Management */}
                      <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg h-fit">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold flex items-center"><Users className="mr-2 h-6 w-6" />Deputy Management</CardTitle>
                                  <CardDescription>Add or remove deputies from your state.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Propose New Deputy</label>
                                  <input
                                    type="text"
                                    value={newDeputyId}
                                    onChange={(e) => setNewDeputyId(e.target.value)}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                                    placeholder="Enter deputy principal ID..."
                                  />
                                  <Button
                                    onClick={handleProposeDeputy}
                                    className="w-full mt-2 p-2 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                                  >
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    Propose
                                  </Button>
                                </div>

                                <div className="border-t pt-4">
                                  <label className="text-sm font-medium text-gray-700">Remove Deputy</label>
                                  <select
                                    value={deputyToRemove}
                                    onChange={(e) => setDeputyToRemove(e.target.value)}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
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
                                    className="w-full mt-2 font-semibold"
                                  >
                                    Remove Deputy
                                  </Button>
                                </div>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* Regional Alerts */}
                      <TimelineContent as="div" animationNum={3.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-red-600" />Regional Alerts</CardTitle>
                            <CardDescription>Critical alerts requiring immediate attention.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {regionalAlerts.map((alert) => (
                              <div key={alert.id} className="rounded-xl border p-4 space-y-3 hover:border-red-500 transition-colors cursor-pointer bg-red-50/50">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{alert.description}</h4>
                                    <p className="text-sm text-gray-600">Deputy: {alert.deputy}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {alert.severity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </TimelineContent>
                  </div>
              </div>
          </main>
      </section>
    </>
  );
}
