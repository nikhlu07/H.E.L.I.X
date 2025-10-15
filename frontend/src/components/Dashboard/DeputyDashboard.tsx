import React, { useState, useRef } from 'react';
import { MapPin, Users, CheckCircle, Clock, AlertTriangle, Building, Truck, FileText, FilePen, ChevronDown } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose } from '../ui/dialog';

export function DeputyDashboard() {
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState('');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
  const [isUpdateProgressDialogOpen, setUpdateProgressDialogOpen] = useState(false);
  const [selectedProjectForUpdate, setSelectedProjectForUpdate] = useState<any>(null);
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

  const handleUpdateProgressClick = (project: any) => {
    setSelectedProjectForUpdate(project);
    setUpdateProgressDialogOpen(true);
  };

  const handleProgressReportSubmit = () => {
    showToast('Progress report submitted successfully!', 'success');
    setUpdateProgressDialogOpen(false);
    setSelectedProjectForUpdate(null);
  };

  const toggleClaimExpansion = (claimId: string) => {
    setExpandedClaimId(prevId => (prevId === claimId ? null : claimId));
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
                          Deputy Dashboard
                      </VerticalCutReveal>
                  </h1>
                  <TimelineContent
                      as="p"
                      animationNum={0}
                      timelineRef={dashboardRef}
                      customVariants={revealVariants}
                      className="text-gray-600 text-lg"
                  >
                      Managing {districtData.districtName} District Projects & Vendor Operations
                  </TimelineContent>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                      {/* District Overview Stats */}
                      <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold">District Overview</CardTitle>
                                  <CardDescription>Key metrics for {districtData.districtName}.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <Building className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">District Budget</p>
                                      <p className="text-2xl font-bold text-gray-900">₹{(districtData.allocatedBudget / 1000000).toFixed(1)}M</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <Truck className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                                      <p className="text-2xl font-bold text-gray-900">{districtData.activeProjects}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <Clock className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                                      <p className="text-2xl font-bold text-gray-900">{districtData.pendingClaims}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-emerald-50 rounded-lg">
                                      <CheckCircle className="h-6 w-6 text-emerald-500 mb-2" />
                                      <p className="text-sm font-medium text-emerald-600">Budget Utilization</p>
                                      <p className="text-2xl font-bold text-emerald-600">{Math.round((districtData.spentBudget / districtData.allocatedBudget) * 100)}%</p>
                                  </div>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* Project Management */}
                      <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">District Project Management</CardTitle>
                            <CardDescription>Monitor the progress of projects in your district.</CardDescription>
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
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {allocatedProjects.map((project) => (
                                  <TableRow key={project.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-semibold">{project.project}</TableCell>
                                    <TableCell className="text-gray-600">{project.area}</TableCell>
                                    <TableCell>₹{project.amount.toLocaleString()}</TableCell>
                                    <TableCell>{project.deadline}</TableCell>
                                    <TableCell>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                        project.status === 'vendor-selection' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-slate-100 text-slate-800'
                                      }`}>
                                        {project.status.replace('-', ' ').toUpperCase()}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100" onClick={() => handleUpdateProgressClick(project)}>
                                        <FilePen className="mr-1 h-4 w-4" /> Progress
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TimelineContent>

                      {/* Community Reports */}
                      <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-red-600" />Community Reports & Feedback</CardTitle>
                            <CardDescription>Feedback and reports from the community.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {communityReports.map((report) => (
                              <div key={report.id} className="rounded-xl border p-4 space-y-3 bg-gray-50/50 hover:border-primary transition-colors">
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
                                      report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
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
                                  <Button variant="outline" size="sm" className="p-2 h-auto border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800">
                                    Investigate
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </TimelineContent>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                       {/* Vendor Selection */}
                       <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold">Vendor Selection</CardTitle>
                              <CardDescription>Assign vendors to projects.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Select Project Allocation</label>
                                <select
                                  value={selectedAllocation}
                                  onChange={(e) => setSelectedAllocation(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
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
                                <label className="text-sm font-medium text-gray-700">Select Vendor</label>
                                <select
                                  value={selectedVendor}
                                  onChange={(e) => setSelectedVendor(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
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
                                className="w-full p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                              >
                                <Users className="mr-2 h-5 w-5" />
                                Assign Vendor to Project
                              </Button>
                            </CardContent>
                          </Card>
                       </TimelineContent>
                      
                      {/* Claim Processing */}
                      <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg h-fit">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold flex items-center"><FileText className="mr-2 h-6 w-6" />Review Claims</CardTitle>
                                  <CardDescription>Approve, reject, or investigate claims.</CardDescription>
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
                                                className="p-2 h-auto border  shadow-lg shadow-black/20 font-semibold rounded-xl bg-black border-black text-white hover:bg-gray-800"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => handleReviewClaim(claim.id, 'investigate')}
                                                size="sm"
                                                className="p-2 h-auto border  shadow-lg shadow-black/20 font-semibold rounded-xl bg-primary border-primary text-white hover:bg-gray-800"
                                            >
                                                Investigate
                                            </Button>
                                            <Button
                                                onClick={() => handleReviewClaim(claim.id, 'reject')}
                                                size="sm"
                                                className="p-2 h-auto border  shadow-lg shadow-black/20 font-semibold rounded-xl bg-red-500 border-red-500 text-white hover:bg-gray-800"
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
                      </TimelineContent>
                  </div>
              </div>
          </main>
      </section>

      <Dialog open={isUpdateProgressDialogOpen} onOpenChange={setUpdateProgressDialogOpen}>
        {selectedProjectForUpdate && (
          <DialogContent className="sm:max-w-[425px] bg-white backdrop-blur-sm rounded-xl">
            <DialogHeader className="flex flex-col items-center text-center py-6">
                <FilePen className="w-10 h-10 mb-2 text-gray-800" />
                <DialogTitle className="text-2xl font-bold">Update Project Progress</DialogTitle>
                <DialogDescription>
                    {selectedProjectForUpdate.project}
                </DialogDescription>
            </DialogHeader>
            <DialogBody className="py-4">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="progress-summary" className="text-sm font-medium text-gray-700">Progress Summary</label>
                        <textarea id="progress-summary" rows={4} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" placeholder="Enter a summary of the project progress..."></textarea>
                    </div>
                    <div>
                        <label htmlFor="report-upload" className="text-sm font-medium text-gray-700">Upload Report</label>
                        <input id="report-upload" type="file" className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"/>
                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                {/*<Button variant="outline" onClick={() => setUpdateProgressDialogOpen(false)}>Cancel</Button>*/}
                <Button onClick={handleProgressReportSubmit} className="p-2 h-auto border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800">Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
