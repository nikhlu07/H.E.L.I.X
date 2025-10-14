import React, { useState, useRef } from 'react';
import { DollarSign, Users, Shield, AlertTriangle, TrendingUp, Building, LayoutDashboard, Eye, Mail, Star, BarChart2, FileText } from 'lucide-react';
import { mockBudgets, mockClaims, mockVendors } from '../../data/mockData';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Vendor } from '../../types';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function MainGovernmentDashboard() {
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetPurpose, setBudgetPurpose] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
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

    const stats = {
        totalBudget: `$${(totalBudget / 1000000).toFixed(1)}M`,
        allocatedBudget: `$${(allocatedBudget / 1000000).toFixed(1)}M`,
        criticalAlerts: criticalClaims,
        pendingVendors: pendingVendors,
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
                                Government Dashboard
                            </VerticalCutReveal>
                        </h1>
                        <TimelineContent
                            as="p"
                            animationNum={0}
                            timelineRef={dashboardRef}
                            customVariants={revealVariants}
                            className="text-gray-600 text-lg"
                        >
                            Oversee budgets, vendors, and claims with precision and transparency.
                        </TimelineContent>
                    </article>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Key Metrics */}
                            <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Key Metrics</CardTitle>
                                        <CardDescription>Real-time overview of the ecosystem.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Total Budget</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalBudget}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Allocated Budget</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.allocatedBudget}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-red-50 rounded-lg">
                                            <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
                                            <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                                            <p className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <Users className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Pending Vendors</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.pendingVendors}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Budget Control Panel */}
                            <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Budget Control Panel</CardTitle>
                                        <CardDescription>Allocate and manage funds securely.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Amount ($)</label>
                                            <input
                                                type="number"
                                                value={budgetAmount}
                                                onChange={(e) => setBudgetAmount(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                placeholder="e.g., 500000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Purpose</label>
                                            <input
                                                type="text"
                                                value={budgetPurpose}
                                                onChange={(e) => setBudgetPurpose(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                placeholder="e.g., Infrastructure 2024"
                                            />
                                        </div>
                                        <Button onClick={handleLockBudget} className="w-full md:col-span-2 p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800">
                                            <Shield className="mr-2 h-5 w-5" />
                                            Lock Budget
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Recent Claims Table */}
                            <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Recent Claims & Corruption Alerts</CardTitle>
                                        <CardDescription>Monitor the latest claims and their risk levels.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Claim ID</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Risk Level</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {mockClaims.slice(0, 5).map((claim) => (
                                                    <TableRow key={claim.id} className="hover:bg-gray-50/50">
                                                        <TableCell className="font-mono text-sm">{claim.id}</TableCell>
                                                        <TableCell className="font-medium">${claim.amount.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                                                                claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                              {claim.riskLevel}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                claim.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                              {claim.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                                                                <Eye className="mr-1 h-4 w-4" /> Review
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                             {/* Emergency Pause */}
                             <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                                <Card className="bg-red-50 border-red-200 shadow-lg">
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-xl font-bold text-red-800">Emergency Control</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex justify-center">
                                        <Button onClick={handleEmergencyPause} variant="destructive" size="lg" className="w-full font-semibold shadow-lg shadow-red-500/30">
                                            <AlertTriangle className="mr-2 h-5 w-5" />
                                            Emergency Pause
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                            
                            {/* Vendor Registry */}
                            <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg h-fit">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold flex items-center"><Building className="mr-2 h-6 w-6" />Vendor Registry</CardTitle>
                                        <CardDescription>Manage and approve vendors.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {mockVendors.slice(0, 4).map((vendor) => (
                                            <div key={vendor.id} className="rounded-xl border p-4 space-y-3 hover:border-black transition-colors cursor-pointer bg-gray-50/50" onClick={() => setSelectedVendor(vendor)}>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                                                        <p className="text-sm text-gray-600">{vendor.businessType}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        vendor.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {vendor.status}
                                                    </span>
                                                </div>
                                                {vendor.status === 'pending' && (
                                                    <Button onClick={(e) => { e.stopPropagation(); handleApproveVendor(vendor.id);}} className="w-full p-2 h-auto border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800">
                                                        Approve
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </div>
                    </div>
                </main>

                {selectedVendor && (
                <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
                    <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-sm rounded-xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{selectedVendor.name}</DialogTitle>
                            <DialogDescription>{selectedVendor.businessType}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-sm font-medium text-gray-600 flex items-center"><FileText className="w-4 h-4 mr-2" />Projects</span>
                                <span className="text-sm font-bold">{selectedVendor.completedProjects}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-sm font-medium text-gray-600 flex items-center"><Star className="w-4 h-4 mr-2" />Rating</span>
                                <span className="text-sm font-bold">{selectedVendor.averageRating}/5</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-sm font-medium text-gray-600 flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Risk Score</span>
                                <span className="text-sm font-bold">{selectedVendor.riskScore}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-sm font-medium text-gray-600 flex items-center"><Mail className="w-4 h-4 mr-2" />Email</span>
                                <span className="text-sm font-bold">{selectedVendor.contactEmail}</span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setSelectedVendor(null)} variant="outline">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            </section>
        </>
    );
}
