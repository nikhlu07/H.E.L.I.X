import React, { useState } from 'react';
import { DollarSign, Users, Shield, AlertTriangle, TrendingUp, Building, LayoutDashboard, Eye, Mail, Star, BarChart2, FileText } from 'lucide-react';
import { mockBudgets, mockClaims, mockVendors } from '../../data/mockData';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Vendor } from '../../types';

export function MainGovernmentDashboard() {
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetPurpose, setBudgetPurpose] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
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

    const stats = {
        totalBudget: `$${(totalBudget / 1000000).toFixed(1)}M`,
        allocatedBudget: `$${(allocatedBudget / 1000000).toFixed(1)}M`,
        criticalAlerts: criticalClaims,
        pendingVendors: pendingVendors,
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
                            <LayoutDashboard className="h-10 w-10 text-yellow-600" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
                            Government Dashboard
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Oversee budgets, vendors, and claims with precision.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.totalBudget}</div>
                                <p className="text-xs text-gray-500">Fiscal Year 2024</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Allocated Budget</CardTitle>
                                <TrendingUp className="h-5 w-5 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.allocatedBudget}</div>
                                <p className="text-xs text-gray-500">Across all projects</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Critical Alerts</CardTitle>
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-600">{stats.criticalAlerts}</div>
                                <p className="text-xs text-gray-500">High-risk claims detected</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Pending Vendors</CardTitle>
                                <Users className="h-5 w-5 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.pendingVendors}</div>
                                <p className="text-xs text-gray-500">Awaiting approval</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Budget Control Panel */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Budget Control Panel</CardTitle>
                            <CardDescription className="text-gray-600">Allocate and manage funds securely.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <input
                                    type="number"
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    placeholder="Enter amount ($)"
                                />
                                <input
                                    type="text"
                                    value={budgetPurpose}
                                    onChange={(e) => setBudgetPurpose(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    placeholder="Purpose, e.g., Infrastructure 2024"
                                />
                                <Button onClick={handleLockBudget} className="w-full cta-gradient font-semibold" size="lg">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Lock Budget
                                </Button>
                                <Button onClick={handleEmergencyPause} variant="destructive" size="lg" className="w-full font-semibold">
                                    <AlertTriangle className="mr-2 h-5 w-5" />
                                    Emergency Pause
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Recent Claims Table */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Recent Claims & Corruption Alerts</CardTitle>
                            <CardDescription className="text-gray-600">Monitor the latest claims and their risk levels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Claim ID</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Risk Level</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockClaims.slice(0, 5).map((claim) => (
                                        <TableRow key={claim.id} className="table-row-hover">
                                            <TableCell className="font-mono text-sm">{claim.id}</TableCell>
                                            <TableCell className="font-medium">${claim.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                                                    claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                  {claim.riskLevel}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    claim.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                  {claim.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700">
                                                    <Eye className="mr-1 h-4 w-4" /> Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Vendor Registry */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center"><Building className="mr-2 h-6 w-6 text-purple-600" />Vendor Registry</CardTitle>
                            <CardDescription>Manage and approve vendors.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {mockVendors.map((vendor) => (
                                    <div key={vendor.id} className="rounded-xl border p-4 space-y-3 hover:border-yellow-500 transition-colors cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                                                <p className="text-sm text-gray-600">{vendor.businessType}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                vendor.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                vendor.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                                {vendor.status}
                                            </span>
                                        </div>
                                        {vendor.status === 'pending' && (
                                            <Button onClick={(e) => { e.stopPropagation(); handleApproveVendor(vendor.id);}} className="w-full" size="sm">
                                                Approve Vendor
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </main>

                {selectedVendor && (
                <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{selectedVendor.name}</DialogTitle>
                            <DialogDescription>{selectedVendor.businessType}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 flex items-center"><FileText className="w-4 h-4 mr-2" />Projects</span>
                                <span className="text-sm font-bold">{selectedVendor.completedProjects}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 flex items-center"><Star className="w-4 h-4 mr-2" />Rating</span>
                                <span className="text-sm font-bold">{selectedVendor.averageRating}/5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Risk Score</span>
                                <span className="text-sm font-bold">{selectedVendor.riskScore}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 flex items-center"><Mail className="w-4 h-4 mr-2" />Email</span>
                                <span className="text-sm font-bold">{selectedVendor.contactEmail}</span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setSelectedVendor(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            </div>
        </>
    );
}
