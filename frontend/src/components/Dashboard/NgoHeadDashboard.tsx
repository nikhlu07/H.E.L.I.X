import { useState, useRef, useEffect } from 'react';
import { DollarSign, Users, Shield, AlertTriangle, TrendingUp, Building, Eye, Mail, Star, BarChart2, FileText, Briefcase, Heart, Gift } from 'lucide-react';
import { useToast } from '../common/Toast';
import { icpCanisterService } from '../../services/icpCanisterService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function NgoHeadDashboard() {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [claims, setClaims] = useState<any[]>([]);
    const { showToast } = useToast();
    const dashboardRef = useRef<HTMLDivElement>(null);

    // New state for budget planning
    const [isPlanningMode, setIsPlanningMode] = useState(false);
    const [budgetPlan, setBudgetPlan] = useState<any[]>([]);
    const [newAllocation, setNewAllocation] = useState({
        program: '',
        amount: '',
        purpose: '',
    });

    const programs = [
        { id: 1, name: "Health Camp", status: "Active", budget: 50000, spent: 25000 },
        { id: 2, name: "Education Drive", status: "Planning", budget: 75000, spent: 0 },
        { id: 3, name: "Food Distribution", status: "Completed", budget: 30000, spent: 30000 },
    ];

    const donations = [
        { id: 1, donor: "Anonymous", amount: 5000, date: "2024-07-20" },
        { id: 2, donor: "Jane Doe", amount: 10000, date: "2024-07-19" },
        { id: 3, donor: "Corporate Partner", amount: 25000, date: "2024-07-18" },
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                await icpCanisterService.init();
                const budgetData = await icpCanisterService.getAllBudgets();
                const serializedBudgetData = budgetData?.map((budgetTuple: any, index: number) => {
                    if (Array.isArray(budgetTuple) && budgetTuple.length >= 2) {
                        const [id, budget] = budgetTuple;
                        return {
                            id: Number(id),
                            amount: Number(budget.amount),
                            purpose: budget.purpose || '',
                        };
                    }
                    return {
                        id: index,
                        amount: budgetTuple.amount ? Number(budgetTuple.amount) : 0,
                        purpose: budgetTuple.purpose || '',
                    };
                });
                setBudgets(serializedBudgetData || []);
                const claimsData = await icpCanisterService.getAllClaims();
                if (claimsData && claimsData.length > 0) setClaims(claimsData);
            } catch (error) {
                console.log('Canister connection failed:', error);
            }
        };
        loadData();
    }, [showToast]);

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

    const handleAddAllocation = () => {
        if (!newAllocation.program || !newAllocation.amount || !newAllocation.purpose) {
            showToast('Please fill in all allocation details', 'warning');
            return;
        }
        const allocation = {
            id: Date.now(),
            ...newAllocation,
            amount: parseInt(newAllocation.amount),
        };
        setBudgetPlan([...budgetPlan, allocation]);
        setNewAllocation({ program: '', amount: '', purpose: '' });
        showToast('Allocation added to plan', 'success');
    };

    const handleRemoveAllocation = (id: number) => {
        setBudgetPlan(budgetPlan.filter(item => item.id !== id));
        showToast('Allocation removed from plan', 'info');
    };

    const handleExecutePlan = async () => {
        if (budgetPlan.length === 0) {
            showToast('No allocations in plan', 'warning');
            return;
        }
        showToast('Executing budget plan...', 'info');
        // In a real app, this would involve canister calls to lock and allocate budget.
        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast('Budget plan executed successfully!', 'success');
        setBudgetPlan([]);
        setIsPlanningMode(false);
    };

    const totalBudget = budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
    const allocatedBudget = programs.reduce((sum, program) => sum + program.budget, 0);

    const stats = {
        totalDonations: `$${(donations.reduce((sum, d) => sum + d.amount, 0) / 1000).toFixed(1)}K`,
        totalBudget: `$${(totalBudget / 1000000).toFixed(1)}M`,
        allocatedBudget: `$${(allocatedBudget / 1000).toFixed(1)}K`,
        activePrograms: programs.filter(p => p.status === 'Active').length,
        totalVolunteers: 150,
    };

    return (
        <>
            <section
                className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start"
                ref={dashboardRef}
            >
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
                <main className="max-w-7xl mx-auto w-full z-10">
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
                                NGO Head Dashboard
                            </VerticalCutReveal>
                        </h1>
                        <TimelineContent
                            as="p"
                            animationNum={0}
                            timelineRef={dashboardRef as React.RefObject<HTMLElement>}
                            customVariants={revealVariants}
                            className="text-gray-600 text-lg"
                        >
                            Oversee programs, volunteers, and operations with precision and transparency.
                        </TimelineContent>
                    </article>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Key Metrics */}
                            <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Key Metrics</CardTitle>
                                        <CardDescription>Real-time overview of the NGO operations.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Total Donations</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Allocated Budget</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.allocatedBudget}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                                            <Briefcase className="h-6 w-6 text-blue-500 mb-2" />
                                            <p className="text-sm font-medium text-blue-600">Active Programs</p>
                                            <p className="text-2xl font-bold text-blue-600">{stats.activePrograms}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                            <Users className="h-6 w-6 text-green-500 mb-2" />
                                            <p className="text-sm font-medium text-green-600">Total Volunteers</p>
                                            <p className="text-2xl font-bold text-green-600">{stats.totalVolunteers}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Budget Allocation */}
                            <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <CardTitle className="text-xl font-bold">Budget Allocation</CardTitle>
                                                <CardDescription>Plan and allocate funds to programs.</CardDescription>
                                            </div>
                                            <Button
                                                onClick={() => setIsPlanningMode(!isPlanningMode)}
                                                variant={isPlanningMode ? "destructive" : "default"}
                                            >
                                                {isPlanningMode ? 'Cancel Planning' : 'Start Planning'}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {isPlanningMode ? (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Program</label>
                                                        <select
                                                            value={newAllocation.program}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, program: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        >
                                                            <option value="">Select Program</option>
                                                            {programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Amount ($)</label>
                                                        <input
                                                            type="number"
                                                            value={newAllocation.amount}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, amount: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                            placeholder="e.g., 10000"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Purpose</label>
                                                        <input
                                                            type="text"
                                                            value={newAllocation.purpose}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, purpose: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                            placeholder="e.g., Medical supplies"
                                                        />
                                                    </div>
                                                    <div className="flex items-end md:col-span-3">
                                                        <Button onClick={handleAddAllocation} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                                            Add to Plan
                                                        </Button>
                                                    </div>
                                                </div>

                                                {budgetPlan.length > 0 && (
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-gray-700">Allocation Plan</h4>
                                                        {budgetPlan.map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                                                <div>
                                                                    <div className="font-medium">{item.program}</div>
                                                                    <div className="text-sm text-gray-600">{item.purpose}</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-semibold">${parseInt(item.amount).toLocaleString()}</div>
                                                                    <Button onClick={() => handleRemoveAllocation(item.id)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Remove</Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                                            <div className="font-semibold">Total: ${budgetPlan.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</div>
                                                            <Button onClick={handleExecutePlan} className="bg-blue-600 hover:bg-blue-700 text-white">Execute Plan</Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <p>Click "Start Planning" to create a budget allocation plan.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Program Monitoring */}
                            <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Program Monitoring</CardTitle>
                                        <CardDescription>Track the status and budget of all programs.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Program</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Budget</TableHead>
                                                    <TableHead>Spent</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {programs.map((program) => (
                                                    <TableRow key={program.id}>
                                                        <TableCell className="font-medium">{program.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={program.status === 'Active' ? 'default' : program.status === 'Completed' ? 'secondary' : 'outline'}>
                                                                {program.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>${program.budget.toLocaleString()}</TableCell>
                                                        <TableCell>${program.spent.toLocaleString()}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm">
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
                        </div>

                        <div className="space-y-8">
                             <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Recent Donations</CardTitle>
                                        <CardDescription>Latest contributions to your cause.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4">
                                            {donations.map(donation => (
                                                <li key={donation.id} className="flex items-center">
                                                    <div className="p-2 bg-green-100 rounded-full mr-4">
                                                        <Gift className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">${donation.amount.toLocaleString()}</p>
                                                        <p className="text-sm text-gray-500">from {donation.donor}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
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
